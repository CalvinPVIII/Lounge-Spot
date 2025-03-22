import { TextField, Button, CircularProgress, Pagination, IconButton, Alert, Snackbar } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MovieHelper from "../helpers/MovieHelper";
import { MovieInfo, QueueVideoInfo, TvSeriesDetails } from "../types";
import "../styles/MoviesSearch.css";
import CloseIcon from "@mui/icons-material/Close";

interface MovieSearchProps {
  handleRequestMovie: (movie: QueueVideoInfo) => void;
}

export default function MoviesSearch(props: MovieSearchProps) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({ current: 0, max: 0 });
  const [searching, setSearching] = useState(false);
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const [searchResults, setSearchResults] = useState<MovieInfo[]>([]);

  const [loading, setLoading] = useState(false);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const handleOpenSuccessSnackbar = () => {
    setSuccessSnackbarOpen(true);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleOpenErrorSnackbar = () => {
    setErrorSnackbarOpen(true);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const [seriesDetails, setSeriesDetails] = useState<TvSeriesDetails | null>(null);

  useEffect(() => {
    const getPopMovies = async () => {
      setSearching(true);
      const result = await MovieHelper.getPopularMovies();
      setSearchResults(result);
      setSearching(false);
    };
    getPopMovies();
  }, []);

  const searchForMovies = async (pageNumber = 1) => {
    if (searchInput === "") return;
    const result = await MovieHelper.searchMoviesAndTv(searchInput, pageNumber);
    setSearchResults(result.results);
    setPagination({ current: result.page, max: result.total_pages });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchForMovies();
  };

  const handlePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (value !== pagination.current) {
      searchForMovies(value);
    }
  };

  const handleMovieClick = async (movie: MovieInfo) => {
    setLoading(true);

    try {
      const url = await MovieHelper.getMovieFile(`/movie/${movie.id.toString()}`);
      if (!url) {
        setLoading(false);
        handleOpenErrorSnackbar();

        return;
      }
      const queueEntry: QueueVideoInfo = {
        title: movie.title,
        thumbnail: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
        url: url,
        type: "Movie",
        channel: movie.media_type,
      };
      console.log(queueEntry);
      props.handleRequestMovie(queueEntry);
      setLoading(false);
      handleOpenSuccessSnackbar();
    } catch {
      setLoading(false);
      handleOpenErrorSnackbar();
    }
  };

  const handleTvClick = async (series: MovieInfo) => {
    const result = await MovieHelper.getTvDetails(series.id.toString());
    setSeriesDetails(result);
  };

  const handleSeriesInfoClose = () => setSeriesDetails(null);

  const handleSelectEpisode = async (seasonNumber: number, episodeNumber: number) => {
    if (seriesDetails) {
      setLoading(true);
      const url = await MovieHelper.getMovieFile(`/tv/${seriesDetails.id}/${seasonNumber}/${episodeNumber}`);
      if (!url) {
        setLoading(false);
        handleOpenErrorSnackbar();

        return;
      }

      const queueEntry: QueueVideoInfo = {
        title: seriesDetails.original_name,
        thumbnail: `https://image.tmdb.org/t/p/original/${seriesDetails.poster_path}`,
        url: url,
        type: "Movie",
        channel: `Season ${seasonNumber} Episode ${episodeNumber}`,
      };
      props.handleRequestMovie(queueEntry);
      setSeriesDetails(null);
      setLoading(false);
    }
  };

  return (
    <div id="movie-search-wrapper">
      {loading ? (
        <div id="loading">
          <div id="progress-wrapper">
            <CircularProgress size={"8rem"} />
          </div>
        </div>
      ) : null}

      {seriesDetails ? (
        <div id="series-info-wrapper">
          <div id="tv-series-info">
            <IconButton onClick={handleSeriesInfoClose}>
              <CloseIcon />
            </IconButton>
            {seriesDetails.seasons.map((season) => (
              <div className="season-card" key={season.id}>
                <h2>{season.name}</h2>
                <div className="episodes">
                  {Array.from({ length: season.episode_count }, (_, i) => (
                    <Button key={i + 1} variant="outlined" onClick={() => handleSelectEpisode(season.season_number, i + 1)}>
                      Episode {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleFormSubmit} className={isBigScreen ? "search-input" : "search-input-small"}>
        <TextField
          placeholder="search for movies or tv series"
          value={searchInput}
          onChange={handleSearchInput}
          variant="standard"
          size="small"
          label="search"
        />
        <Button type="submit">Search</Button>
      </form>
      {searching ? (
        <CircularProgress />
      ) : (
        <div className={isBigScreen ? "movie-search-results" : "movie-search-results-small"}>
          {searchResults.map((result) => (
            <div className="result-wrapper" key={result.id}>
              <div className={"search-result"}>
                <img className="movie-result-img" src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} />
                <div className="movie-info">
                  <p>{result.title}</p>
                  <p>{result.release_date ? `(${result.release_date.slice(0, 4)})` : null}</p>
                </div>
              </div>
              {result.media_type === "movie" ? (
                <Button color="secondary" onClick={() => handleMovieClick(result)}>
                  Add To Queue
                </Button>
              ) : (
                <Button color="secondary" onClick={() => handleTvClick(result)}>
                  Browse Episodes
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {pagination.max ? <Pagination count={pagination.max} defaultPage={pagination.current} siblingCount={1} onChange={handlePagination} /> : null}
      <Snackbar open={successSnackbarOpen} autoHideDuration={2000} onClose={handleCloseSuccessSnackbar}>
        <Alert onClose={handleCloseSuccessSnackbar} severity="success">
          Video added to queue
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
        <Alert onClose={handleCloseErrorSnackbar} severity="error">
          Error loading content, please try again
        </Alert>
      </Snackbar>
    </div>
  );
}
