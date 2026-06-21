const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to construct TMDB URLs
function getEndpointUrl(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
}

/**
 * Fetches movies for browse/search with customized 12-item pagination.
 * TMDB API pages return exactly 20 items.
 * We adapt these pages to match our 12-items-per-page pagination client requirement.
 */
export async function getMovies({ query = '', page = 1 } = {}) {
  if (!API_KEY) {
    throw new Error("TMDB API Key is missing. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.");
  }

  const itemsPerPage = 12;
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = page * itemsPerPage - 1;

  // Find the 0-indexed TMDB pages containing the start and end indices of the client page
  const pageA = Math.floor(startIdx / 20) + 1;
  const pageB = Math.floor(endIdx / 20) + 1;

  const endpoint = query ? 'search/movie' : 'movie/popular';
  
  let results = [];
  let totalResults = 0;

  if (pageA === pageB) {
    // Both startIdx and endIdx reside on the same TMDB page
    const params = { page: pageA };
    if (query) params.query = query;

    const res = await fetch(getEndpointUrl(endpoint, params));
    if (!res.ok) {
      throw new Error(`Failed to fetch movies from TMDB API: Status ${res.status}`);
    }
    const data = await res.json();
    results = data.results || [];
    totalResults = data.total_results || 0;
  } else {
    // Indices cross TMDB page boundary, fetch both pages concurrently
    const paramsA = { page: pageA };
    const paramsB = { page: pageB };
    if (query) {
      paramsA.query = query;
      paramsB.query = query;
    }

    const [resA, resB] = await Promise.all([
      fetch(getEndpointUrl(endpoint, paramsA)),
      fetch(getEndpointUrl(endpoint, paramsB))
    ]);

    if (!resA.ok || !resB.ok) {
      throw new Error(`Failed to fetch movies from TMDB API: Status ${resA.status} or ${resB.status}`);
    }

    const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);
    results = [...(dataA.results || []), ...(dataB.results || [])];
    totalResults = dataA.total_results || 0;
  }

  // Calculate the slice offset relative to the start of the first TMDB page fetched (pageA)
  // For pageA, its first item is at global index (pageA - 1) * 20.
  const sliceOffset = startIdx - (pageA - 1) * 20;
  const slicedMovies = results.slice(sliceOffset, sliceOffset + itemsPerPage);

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return {
    movies: slicedMovies,
    totalResults,
    totalPages,
    currentPage: page
  };
}

/**
 * Fetches additional movie details (genres, runtime, taglines, etc.)
 */
export async function getMovieDetails(movieId) {
  if (!API_KEY) {
    throw new Error("TMDB API Key is missing. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.");
  }

  const res = await fetch(getEndpointUrl(`movie/${movieId}`));
  if (!res.ok) {
    throw new Error(`Failed to fetch movie details from TMDB API: Status ${res.status}`);
  }
  return await res.json();
}
