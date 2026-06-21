import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '@/services/tmdb';

export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { title, poster_path, overview, release_date, vote_average } = movie;

  // TMDB Poster image URL path
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : null;

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        setLoading(true);
        const data = await getMovieDetails(movie.id);
        if (active) {
          setDetails(data);
        }
      } catch (err) {
        console.error("Failed to load extra details:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    // Listen for Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      active = false;
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [movie.id, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Safe variables fallback
  const finalGenres = details?.genres || [];
  const runtime = details?.runtime || null;
  const tagline = details?.tagline || '';
  const status = details?.status || 'Released';
  const originalLanguage = details?.original_language?.toUpperCase() || 'EN';
  const budget = details?.budget ? `$${details.budget.toLocaleString()}` : null;
  const revenue = details?.revenue ? `$${details.revenue.toLocaleString()}` : null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close details modal"
        >
          ✕
        </button>

        <div className="modal-grid">
          <div className="modal-poster-wrapper">
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={`${title} poster`} 
                className="modal-poster"
              />
            ) : (
              <div className="state-container" style={{ padding: '4rem 1rem', height: '100%', justifyContent: 'center', background: '#1e293b' }}>
                <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</span>
                <span style={{ fontWeight: '600', color: '#94a3b8' }}>No Poster</span>
              </div>
            )}
          </div>

          <div className="modal-info">
            <h2 className="modal-title">{title}</h2>
            {tagline && <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem' }}>"{tagline}"</p>}

            <div className="modal-meta-row">
              <span className="modal-rating-badge">⭐ {vote_average?.toFixed(1) || 'N/A'} / 10</span>
              {release_date && <span>📅 {release_date}</span>}
              {runtime && <span>⏱️ {runtime} min</span>}
              <span>🌐 {originalLanguage}</span>
            </div>

            {finalGenres.length > 0 && (
              <div className="modal-genre-tags">
                {finalGenres.map((g) => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            )}

            <div>
              <h4 className="modal-section-title">Overview</h4>
              <p className="modal-overview">{overview || 'No overview available for this movie.'}</p>
            </div>

            {!loading && details && (
              <div>
                <h4 className="modal-section-title">Production Details</h4>
                <div className="modal-detail-row">
                  <span className="modal-detail-label">Status</span>
                  <span className="modal-detail-value">{status}</span>
                </div>
                {budget && budget !== '$0' && (
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Budget</span>
                    <span className="modal-detail-value">{budget}</span>
                  </div>
                )}
                {revenue && revenue !== '$0' && (
                  <div className="modal-detail-row">
                    <span className="modal-detail-label">Revenue</span>
                    <span className="modal-detail-value">{revenue}</span>
                  </div>
                )}
              </div>
            )}
            
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></div>
                <span style={{ fontSize: '0.85rem' }}>Loading additional details...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
