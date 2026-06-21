import React from 'react';

export default function MovieCard({ movie, isFavorited, onToggleFavorite, onClick }) {
  const { title, poster_path, release_date, vote_average } = movie;

  // Extract release year from release_date (YYYY-MM-DD)
  const releaseYear = release_date ? release_date.split('-')[0] : 'N/A';

  // Format rating to 1 decimal place
  const rating = vote_average !== undefined ? vote_average.toFixed(1) : 'N/A';

  // TMDB Poster image URL path
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : null;

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent opening details modal when favorited
    onToggleFavorite(movie);
  };

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrapper">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`${title} poster`} 
            className="movie-poster" 
            loading="lazy"
          />
        ) : (
          <div className="state-container" style={{ padding: '2rem 1rem', height: '100%', justifyContent: 'center', background: '#1e293b' }}>
            <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎬</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>No Poster Available</span>
          </div>
        )}
        <button
          type="button"
          className={`card-fav-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? '♥' : '♡'}
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title" title={title}>{title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{releaseYear}</span>
          <div className="movie-rating" aria-label={`Rating: ${rating} out of 10`}>
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
