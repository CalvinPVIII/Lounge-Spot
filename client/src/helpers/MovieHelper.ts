import { MovieFileResponse, MovieInfo, MovieSearchResults, TvInfo, TvSeriesDetails } from "../types";
import { type SubtitleData, parseToVTT, searchSubtitles, SearchSubtitlesParams } from "wyzie-lib";

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

  static async getMovieFile(movieId: number, seasonNumber?: number, episodeNumber?: number) {
    try {
      let url = "";
      if (seasonNumber && episodeNumber) {
        url = `${import.meta.env.VITE_FETCH_MOVIES_API_URL}tv/${movieId}/${seasonNumber}/${episodeNumber}`;
      } else {
        url = `${import.meta.env.VITE_FETCH_MOVIES_API_URL}movie/${movieId}`;
      }
      const response = await fetch(url);
      const result = (await response.json()) as MovieFileResponse;

      const subtitles = await MovieHelper.getSubtitles(movieId, seasonNumber, episodeNumber);

      return { videoSource: result.videoSource, subtitles: [subtitles[0]] };
    } catch {
      return null;
    }
  }

  static async getTvDetails(id: string) {
    const url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };
    const response = await fetch(url, options);
    const result = (await response.json()) as TvSeriesDetails;
    return result;
  }

  static async getSubtitles(movieId: number, seasonNumber?: number, episodeNumber?: number) {
    const params: SearchSubtitlesParams =
      seasonNumber !== undefined && episodeNumber !== undefined
        ? { tmdb_id: movieId, season: seasonNumber, episode: episodeNumber, format: "srt" }
        : { tmdb_id: movieId, format: "srt" };

    const data: SubtitleData[] = await searchSubtitles(params);
    console.log(data);
    return data
      .filter((sub) => {
        return sub.language === "en";
      })
      .map((sub) => ({ lang: sub.display, file: sub.url }));
  }
}
