import React from 'react';

export default function Header({ 
  searchVal, 
  setSearchVal, 
  onlyFavorites, 
  setOnlyFavorites,
  favoritesCount
}) {
  const handleClear = () => {
    setSearchVal('');
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); setSearchVal(''); setOnlyFavorites(false); }}>
          <span className="logo-icon">🎬</span>
          <span>MovieFinder</span>
        </a>

        <div className="header-controls">
          <div className="search-form">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search movies by title..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            {searchVal && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={handleClear}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className={`fav-toggle-btn ${onlyFavorites ? 'active' : ''}`}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
          >
            <span className="heart-icon">♥</span>
            <span>Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
