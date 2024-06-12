import { TextField, Button, CircularProgress, Pagination } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MovieHelper from "../helpers/MovieHelper";
import { MovieInfo, QueueVideoInfo } from "../types";
import "../styles/MoviesSearch.css";

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
    const url = await MovieHelper.getMovieFile(movie.id.toString());
    if (url === "") {
      return;
    }
    console.log("adding movie");
    const queueEntry: QueueVideoInfo = {
      title: movie.title,
      thumbnail: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
      url: url,
      type: "Movie",
      channel: movie.media_type,
    };
    props.handleRequestMovie(queueEntry);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className={isBigScreen ? "search-input" : "search-input-small"}>
        <TextField
          placeholder="paste url or search"
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
            <div key={result.id} className={"search-result"}>
              <img className="movie-result-img" src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} />
              <div className="movie-info">
                <p>{result.title}</p>
                <p>{result.release_date ? `(${result.release_date.slice(0, 4)})` : null}</p>
              </div>

              <Button color="secondary" onClick={() => handleMovieClick(result)}>
                Add To Queue
              </Button>
            </div>
          ))}
        </div>
      )}
      {pagination.max ? <Pagination count={pagination.max} defaultPage={pagination.current} siblingCount={1} onChange={handlePagination} /> : null}
    </>
  );
}
