import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import "./FullMoviePage.css";
const API = import.meta.env.VITE_API_URL;

function FullMoviePage() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/movies/fullmovie`)
      .then(res => setMovies(res.data.movies))
      .catch(err => console.error(err));
  }, []);

  // 🎬 Video Player View
  if (selectedMovie) {
    return (
      <div className="player-container">
        <button className="back-btn" onClick={() => setSelectedMovie(null)}>
          <IoMdArrowRoundBack /> Back
        </button>

        <h3 className="movie-title">{selectedMovie.title}</h3>

        <video
          controls
          autoPlay
          preload="metadata"
          playsInline
          className="video-player"
        >
          <source src={selectedMovie.video_url} type="video/mp4" />
        </video>

      </div>
    );
  }

  // 🎞 Movie Grid View
  return (
    <div className="movie-page">
      <h3 className="section-title">Movies</h3>

      <div className="movie-grid">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => setSelectedMovie(movie)}
          >
            <img src={movie.poster_url} alt={movie.title} />

            <div className="overlay">
              <FaPlay className="play-icon" />
              <p className="movie-name">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FullMoviePage;
