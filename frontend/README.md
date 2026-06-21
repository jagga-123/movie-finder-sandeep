# Movie Discovery App

A high-fidelity Movie Discovery web application built using **Next.js** and styled with premium **Vanilla CSS**. The application fetches real-time movie data from **The Movie Database (TMDB) API** and features customized 12-item pagination, instant debounced search-as-you-type, personal favorites (persisted locally), and a detailed movie review overlay.

## Features

1. **Browse Movies:** View popular titles in a fully responsive grid showing the poster, title, release year, and star rating.
2. **Dynamic Search:** Search for movies by title with results updating in real-time as you type (400ms debounce buffer).
3. **Detail View Modal:** Click on any movie card to slide in detailed information including full overview summary, taglines, runtimes, genres, and production financials.
4. **Persisted Favorites:** Save or remove movies from your local storage favorites. View and paginate favorites in a dedicated filter screen.
5. **Robust UI States:** Elegant loaders, detailed error handling alerts, and "No results found" placeholder feedback.
6. **Strict Pagination:** Manual pagination with Prev/Next buttons showing exactly 12 items per page.

---

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### 1. Installation

Clone or enter the project directory and install the necessary package dependencies:

```bash
npm install
```

### 2. Configure TMDB API Key

This project requires a free API key from TMDB.

1. Register or log in to [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Head to **Settings > API** in your profile dashboard to create an API Key (or Read Access Token).
3. Create a file named `.env.local` in the root of the project.
4. Paste your key using the following environment variable name:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Run Development Server

Launch the Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the application!

### 4. Build and Validate Production

Compile the application to a production build to check output correctness:

```bash
npm run build
npm start
```
