'use client';

import React, { useState, useEffect } from 'react';
import { getMovies } from '@/services/tmdb';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import Pagination from '@/components/Pagination';
import Footer from '@/components/Footer';

export default function Home() {
  // Search input state (controlled, updates instantly)
  const [searchVal, setSearchVal] = useState('');
  // Debounced search query (updates after debounce, triggers API call)
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Movie data state
  const [movies, setMovies] = useState([]);
  
  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesLoaded, setIsFavoritesLoaded] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  
  // Selected movie for details modal
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem('movie-finder-favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (err) {
        console.error("Failed to parse favorites from localStorage:", err);
      }
    }
    setIsFavoritesLoaded(true);
  }, []);

  // 2. Save favorites to localStorage when state updates
  useEffect(() => {
    if (isFavoritesLoaded) {
      localStorage.setItem('movie-finder-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isFavoritesLoaded]);

  // 3. Debounce search input value to trigger API search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
      // Reset to page 1 when user types a new search query
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // 4. Toggle behavior: disable favorites filter when search text is entered
  useEffect(() => {
    if (searchVal) {
      setOnlyFavorites(false);
    }
  }, [searchVal]);

  // 5. Toggle behavior: clear search and reset page when favorites toggle is activated
  useEffect(() => {
    if (onlyFavorites) {
      setSearchVal('');
      setPage(1);
    }
  }, [onlyFavorites]);

  // 6. Fetch movies from TMDB API on page, query, or favorites toggle change
  useEffect(() => {
    if (onlyFavorites) {
      // Favorites browse runs entirely on client-side state
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;

    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovies({ query: searchQuery, page });
        if (active) {
          setMovies(data.movies);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load movies. Please check your network and API configuration.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      active = false;
    };
  }, [searchQuery, page, onlyFavorites]);

  // Handle adding/removing favorites
  const handleToggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isFav = prev.some((item) => item.id === movie.id);
      if (isFav) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  // Determine movies and pagination info to display
  const favsPerPage = 12;
  const totalFavs = favorites.length;
  const totalFavsPages = Math.ceil(totalFavs / favsPerPage) || 1;

  // Auto-adjust page if favorites are deleted making the current page empty
  useEffect(() => {
    if (onlyFavorites && page > totalFavsPages) {
      setPage(Math.max(1, totalFavsPages));
    }
  }, [favorites, onlyFavorites, page, totalFavsPages]);

  const displayedMovies = onlyFavorites
    ? favorites.slice((page - 1) * favsPerPage, page * favsPerPage)
    : movies;

  const activeTotalPages = onlyFavorites ? totalFavsPages : totalPages;

  return (
    <>
      <Header
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        onlyFavorites={onlyFavorites}
        setOnlyFavorites={setOnlyFavorites}
        favoritesCount={favorites.length}
      />

      <main className="main-content container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            {onlyFavorites 
              ? 'Your Favorite Movies' 
              : searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : 'Popular Movies'}
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <h3 className="state-title">Loading Movies</h3>
            <p className="state-desc">Fetching the latest film database entries...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="state-container">
            <div className="error-container">
              <span className="error-icon">⚠️</span>
              <h3 className="state-title">An Error Occurred</h3>
              <p className="state-desc">{error}</p>
              {!error.includes("API Key is missing") && (
                <button 
                  type="button" 
                  className="retry-btn"
                  onClick={() => {
                    // Re-trigger effect by resetting page state or page value
                    setPage((p) => p);
                    // Or call TMDB directly to verify
                    setSearchQuery((q) => q);
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty / No Results State */}
        {!loading && !error && displayedMovies.length === 0 && (
          <div className="state-container">
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</span>
            <h3 className="state-title">No Movies Found</h3>
            <p className="state-desc">
              {onlyFavorites 
                ? "You haven't added any movies to your favorites list yet." 
                : `We couldn't find any results matching "${searchQuery}". Please try another search term.`}
            </p>
          </div>
        )}

        {/* Movie Responsive Grid */}
        {!loading && !error && displayedMovies.length > 0 && (
          <>
            <div className="movie-grid">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorited={favorites.some((item) => item.id === movie.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>

            {/* Pagination controls */}
            <Pagination
              currentPage={page}
              totalPages={activeTotalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </main>

      <Footer />

      {/* Movie Details Modal Overlay */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
