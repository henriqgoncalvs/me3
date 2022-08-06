import fetch from 'isomorphic-unfetch';

export const TMDB_API_KEY = process.env.TMDB_API_KEY;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const getMovieSearch = async ({ q }: { q: string }) => {
  const tmdbUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${q}&page=1&include_adult=false`;

  const response = await fetch(tmdbUrl);

  const data = await response.json();

  return data;
};

export type MovieFromTMBD = {
  id: number;
  title: string;
  poster_path?: string;
  // "2002-05-01"
  release_date: string;
  overview: string;
};

export type TMDBApiResponse = {
  results: MovieFromTMBD[];
};
