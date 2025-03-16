import { TextField, Button, CircularProgress, Pagination, IconButton, Alert, Snackbar } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MovieHelper from "../helpers/MovieHelper";
import { MovieInfo, MovieInSearchResult, QueueVideoInfo } from "../types";
import "../styles/MoviesSearch.css";
import CloseIcon from "@mui/icons-material/Close";

interface MovieSearchProps {
  handleRequestMovie: (movie: QueueVideoInfo) => void;
}

export default function MoviesSearch(props: MovieSearchProps) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

  const [searchInput, setSearchInput] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pagination] = useState({ current: 0, max: 0 });
  const [searching, setSearching] = useState(false);
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const [searchResults, setSearchResults] = useState<MovieInSearchResult[]>([]);

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

  const [seriesDetails, setSeriesDetails] = useState<MovieInfo | null>(null);

  const searchForMovies = async (pageNumber = 1) => {
    if (searchInput === "") return;
    setSearching(true);
    const result = await MovieHelper.searchMovie(searchInput, pageNumber);
    setSearchResults(result.results);
    setSearching(false);
    // setPagination({ current: result.page, max: result.total_pages });
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

  const handleMovieClick = async (movie: MovieInSearchResult) => {
    setLoading(true);

    try {
      const movieInfo = await MovieHelper.getMovieInfo(movie.id.toString());
      const movieStream = await MovieHelper.getMovieStreams(movieInfo.id, movieInfo.episodes[0].id);
      const url = movieStream.sources[0].url;

      const queueEntry: QueueVideoInfo = {
        title: movie.title,
        thumbnail: movie.image,
        url: url,
        type: "Movie",
        channel: movieInfo.type,
      };
      props.handleRequestMovie(queueEntry);
      setLoading(false);
      handleOpenSuccessSnackbar();
    } catch {
      setLoading(false);
      handleOpenErrorSnackbar();
    }
  };

  const handleTvClick = async (series: MovieInSearchResult) => {
    setLoading(true);
    const result = await MovieHelper.getMovieInfo(series.id.toString());
    setSeriesDetails(result);
    setLoading(false);
  };

  const handleSeriesInfoClose = () => setSeriesDetails(null);

  const handleChoseEpisode = async (movieId: string, episodeId: string, episodeTitle: string) => {
    try {
      setLoading(true);
      const stream = await MovieHelper.getMovieStreams(movieId, episodeId);
      const url = stream.sources[0].url;
      const queueEntry: QueueVideoInfo = {
        title: episodeTitle,
        thumbnail: seriesDetails?.image,
        url: url,
        type: "Movie",
        channel: "TV Series",
      };
      props.handleRequestMovie(queueEntry);
      setLoading(false);
      handleOpenSuccessSnackbar();
    } catch {
      setLoading(false);
      handleOpenErrorSnackbar();
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
            {seriesDetails.episodes.length === 0 && <h2>No Episodes Found :(</h2>}
            {seriesDetails.episodes.map((episode) => (
              <div>
                <h2 className="episode-name" onClick={() => handleChoseEpisode(seriesDetails.id, episode.id, episode.title)}>
                  S{episode.season} EP{episode.number}: {episode.title}
                </h2>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleFormSubmit} className={isBigScreen ? "search-input" : "search-input-small"}>
        <TextField placeholder="search for movies" value={searchInput} onChange={handleSearchInput} variant="standard" size="small" label="search" />
        <Button type="submit">Search</Button>
      </form>
      {searching ? (
        <CircularProgress />
      ) : (
        <div className={isBigScreen ? "movie-search-results" : "movie-search-results-small"}>
          {searchResults ? (
            <>
              {searchResults.map((result) => (
                <div className="result-wrapper" key={result.id}>
                  <div className={"search-result"}>
                    <img className="movie-result-img" src={result.image} />
                    <div className="movie-info">
                      <p>{result.title}</p>
                      <p>{result.releaseDate}</p>
                    </div>
                  </div>

                  {result.type === "Movie" ? (
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
            </>
          ) : (
            <p></p>
          )}
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
