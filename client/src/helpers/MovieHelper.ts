import { MovieFileResponse, MovieInfo, MovieSearchResults } from "../types";

export default class MovieHelper {
  // static async getPopularMovies() {
  //   const response = await fetch(`https://consumet-api-delta.vercel.app/movies/flixhq/trending`);
  //   const data = (await response.json()) as MovieSearchResults;
  //   return data.results;
  // }

  static async searchMovie(query: string, pageNumber: number) {
    const response = await fetch(`https://consumet-api-delta.vercel.app/movies/flixhq/${query}?page=${pageNumber}`);
    const data = await response.json();
    console.log(data);
    return data as MovieSearchResults;
  }

  static async getMovieInfo(movieId: string) {
    const response = await fetch(`https://consumet-api-delta.vercel.app/movies/flixhq/info?id=${movieId}`);
    const data = await response.json();
    return data as MovieInfo;
  }

  static async getMovieStreams(movieId: string, episodeId: string) {
    const response = await fetch(`https://consumet-api-delta.vercel.app/movies/flixhq/watch?episodeId=${episodeId}&mediaId=${movieId}`);
    const data = await response.json();
    return data as MovieFileResponse;
  }
}
