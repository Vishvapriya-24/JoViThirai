const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();

const API_KEY = "57a64673396bec00e661410df51019d4";
const BASE_URL = "https://api.themoviedb.org/3";

const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false, 
});
axios.defaults.httpsAgent = agent;

const getSeries = async (req, res) => {
  const { region } = req.params;
  const languageMap = {
    korean: "ko",
    chinese: "zh",
    indian: "hi",     
    american: "en",
  };
  const language = languageMap[region];

  if (!language) {
    return res.status(400).json({ error: "Invalid region" });
  }

  try {
    const response = await axios.get(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        with_original_language: language,
        sort_by: "popularity.desc",
        page: 1,
      },
    });

    const series = response.data.results
      .filter((s) => s.poster_path || s.backdrop_path)
      .map((s) => ({
        id: s.id,
        name: s.name,
        overview: s.overview,
        poster: s.poster_path
          ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
          : `https://image.tmdb.org/t/p/w780${s.backdrop_path}`,
        backdrop: s.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${s.backdrop_path}`
          : null,
        rating: s.vote_average,
        releaseDate: s.first_air_date,
        language: s.original_language,
      }));

    res.json(series);
  } catch (err) {
    console.error("Error fetching series:", err.message);
    res.status(500).json({ error: "Failed to fetch series" });
  }
};

const getSeriesDetails = async (req,res) => {
    const { seriesId } = req.params;

  try {
    const [videoRes, detailsRes, casting] = await Promise.all([
      axios.get(`${BASE_URL}/tv/${seriesId}/videos`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`${BASE_URL}/tv/${seriesId}`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`${BASE_URL}/tv/${seriesId}/credits`, {
      params : { api_key : API_KEY },
      })
    ]);

    let trailer = videoRes.data.results.find(
      (v) =>
        v.site === "YouTube" &&
        ["Trailer", "Teaser"].includes(v.type) &&
        v.official === true
    );

    if (!trailer) {
      trailer = videoRes.data.results.find(
        (v) => v.site === "YouTube" && ["Trailer", "Teaser"].includes(v.type)
      );
    }

    const series = detailsRes.data;

    const details = {
      id: series.id,
      title: series.name,
      overview: series.overview,
      rating: series.vote_average,
      first_air_date: series.first_air_date,
      language: series.original_language,
      total_seasons: series.number_of_seasons,
      total_episodes: series.number_of_episodes,
      backdrop: series.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
        : null,
      poster: series.poster_path
        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
        : null,
    };

    const trailerUrl = trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null;

    const cast = casting.data.cast
      .slice(0,10)
      .map((actor) => ({
        id:actor.id,
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
    console.error(
      `❌ Error fetching trailer/details for series ${seriesId}:`,
      err.message
    );
    res.status(500).json({ error: "Failed to fetch series data" });
  }
};

const getSeriesRecommendation = async (req,res) => {
  const {seriesId} = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}/recommendations`, {
      params : {
        api_key : API_KEY
      }
    });

    const recommendations = response.data.results
      .filter((s) => s.poster_path)
      .slice(0, 10)
      .map((s) => ({
        id: s.id,
        title: s.name,
        poster: `https://image.tmdb.org/t/p/w500${s.poster_path}`,
        backdrop: s.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${s.backdrop_path}`
          : null,
        rating: s.vote_average,
      }));

    res.json(recommendations);
  }
  catch(err) {
    console.error("Error fetching recommendation  of series", err.message);
    res.status(500).json({error:"failed to fetch recommendation series data"});
  }
};

module.exports = {
    getSeries,
    getSeriesDetails,
    getSeriesRecommendation,
};