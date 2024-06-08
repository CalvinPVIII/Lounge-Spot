import { MovieInfo, MovieSearchResults, TvInfo } from "../types";

export default class MovieHelper {
  static async getPopularMovies() {
    const url = "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    return result.results as MovieInfo[];
  }

  static async searchMoviesAndTv(query: string, page = 1) {
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    result.results = result.results
      .filter((result: MovieInfo | TvInfo) => result.media_type !== "person")
      .map((result: MovieInfo | TvInfo) => {
        if (result.media_type === "movie") {
          return result;
        } else if (result.media_type === "tv") {
          const tvRes = result as TvInfo;
          return { title: tvRes.name, id: tvRes.id, release_date: tvRes.first_air_date, poster_path: tvRes.poster_path };
        }
      });
    return result as MovieSearchResults;
  }
}