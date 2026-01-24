const express = require('express');
const axios = require('axios');
const https = require('https');
const db = require('./Database');
const app = express();
require('dotenv').config()

const API_KEY =  process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;

const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false, 
});
axios.defaults.httpsAgent = agent;

const getMovieTrailer = async (req, res) => {
  const { movieId } = req.params;

  try {
    const [videoRes, detailsRes, Casting] = await Promise.all([
      axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
        params: { api_key: API_KEY },
      }),
    ]);

    let trailer = videoRes.data.results.find(
      (v) => v.site === "YouTube" && ["Trailer", "Teaser"].includes(v.type)
    );
    if (!trailer) {
      trailer = videoRes.data.results.find((v) => v.site === "YouTube");
    }

    const movie = detailsRes.data;

    const details = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      rating: movie.vote_average,
      release_date: movie.release_date,
      language: movie.original_language,
      adult_content: movie.adult,
      backdrop: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
    };

    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    const cast = Casting.data.cast
      .slice(0,10)
      .map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        image: actor.profile_path
          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
          : null,
      }));
    
    res.json({
      trailer: trailerUrl,
      details,
      cast,
    });
  } catch (err) {
    console.error(`❌ Error fetching trailer/details for movie ${movieId}:`, err.message);
    res.status(500).json({ error: "Failed to fetch movie data" });
  }
};


const getRecommendation = async (req, res) => {
  const { movieId } = req.params;

  try {
    const recommendation = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 },
    });

    const recommendation_movies = recommendation.data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
        : "https://via.placeholder.com/342x513?text=No+Image",
    }));

    res.json(recommendation_movies);
  } catch (err) {
    console.error(`❌ Error fetching recommendation for movie ${movieId}:`, err.message);
    res.status(500).json({ error: "Failed to fetch recommendation movie data" });
  }
};


const carousel = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 },
    });

    const posters = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview.split('.')[0],
      poster: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
    }));

    res.json(posters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getNowPlayingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        region: "IN",
        page: 1,
      },
    });

    const movies = response.data.results.map((m) => (
      {
        id: m.id,
        title: m.title,
        poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
      }
    ));

    res.json(movies);
  } catch (err) {
    console.error("🔥 Error fetching now playing movies:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 },
    });

    const posters = response.data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
    }));

    res.json(posters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: { api_key: API_KEY, language: "en-US", page: 2, region: "IN" },
    });

    const posters = response.data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
    }));

    res.json(posters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUpCommingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: { api_key: API_KEY, language: "en-US", page: 3 },
    });

    const posters = response.data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
    }));
    
    res.json(posters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllFullMovie = async (req, res) => {
  const select_query = "SELECT id, title, video_url, poster_url FROM movies";
  db.query(select_query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Movie fetch failed" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }

    return res.status(200).json({
      message: "Movies fetched successfully",
      movies: result
    });
  });
};


module.exports = {
  carousel,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpCommingMovies,
  getMovieTrailer,
  getRecommendation,
  getAllFullMovie
};
