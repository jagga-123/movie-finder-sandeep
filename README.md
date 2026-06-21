# Movie Discovery App - Repository Layout

This repository contains the Movie Discovery App structured into frontend and backend folders.

## Folder Structure

```
movie-finder-sandeep/
├── frontend/             # Next.js frontend application
│   ├── src/              # React components, services, page router layout
│   ├── public/           # Static public assets
│   ├── .env.local        # Environment variable configuration (TMDB API key)
│   └── package.json      # Dependencies and scripts
├── backend/              # Backend directory (Empty/No backend needed)
├── AI_LOG.md             # AI coding log (Required for assessment)
└── README.md             # Root repository layout instructions (this file)
```

---

## How to Run

Since the application is fully client-side and fetches directly from TMDB API:

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure your TMDB API Key:**
   Create a `.env.local` file inside the `frontend/` directory with:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open in browser:**
   Open [http://localhost:3000](http://localhost:3000) to view the app!
