import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiLogoImdb } from "react-icons/bi";
import MoviesRow from "./MoviesRow";

const fetchMovieDetails = async (movieId) => {
  const res = await axios.get(`http://localhost:8000/movies/movieDetails/${movieId}`);
  return res.data;
};

function MovieDetails() {
  const { state: movie } = useLocation();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [ShowTrailer, setShowTrailer] = useState(false);

  // 🚫 Safety check if no movie data+
  if (!movie)
    return <h2 style={styles.centerText}>Movie not found</h2>;

  // 🎬 Fetch trailer and details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movieDetails", movie.id],
    queryFn: () => fetchMovieDetails(movie.id),
    enabled: !!movie,
  });

  // 🎞️ Update trailer URL
  useEffect(() => {
    if (data?.trailer) setTrailerUrl(data.trailer);
  }, [data]);

  if (isLoading) return <h2 style={styles.centerText}>Loading...</h2>;
  if (isError) return <h2 style={styles.errorText}>Failed to load movie details</h2>;
  if (!data?.details) return <h2 style={styles.centerText}>No details found</h2>;

  const md = data.details;
  const cast = data.cast;
  const embedUrl = trailerUrl
    ? trailerUrl.replace("watch?v=", "embed/")
    : null;

  return (
    <div style={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <section style={styles.hero}>
        {/* --- Left Info Section --- */}
        <div style={styles.info}>
          <h1 style={styles.title}>{md.title}</h1>

          <p style={styles.rating}>
            <BiLogoImdb style={{ color: "yellow", fontSize: "2em" }} />
            {md.rating} /10
          </p>

          <p style={styles.streams}>
            <span style={{ color: "red" }}>2B+</span> Streams
          </p>

          <p style={styles.language}>Language: {md.language}</p>

          {/* --- Buttons --- */}
          <div style={styles.buttons}>
            <button
              style={styles.playButton}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b00610")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e50914")}
            >
              Play
            </button>

            {trailerUrl ? (
              <button
                style={styles.trailerButton}
                onClick={() => setShowTrailer(true)}
                onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.3)")
                }
                onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.15)")
                }
              >
                Watch Trailer
              </button>
            ) : (
              <p style={{ color: "#aaa" }}>
                Trailer not available
              </p>
            )}

            {ShowTrailer && embedUrl && (
              <div style={styles.trailerOverlay}>
                <div style={styles.trailerContainer}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowTrailer(false)}
                  >
                    ✕
                  </button>

                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="Series Trailer"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
            )}


          </div>
        </div>

        {/* --- Right Image Section --- */}
        <div style={styles.imageContainer}>
          <div style={styles.fadeOverlay}></div>
          <img src={md.backdrop} alt={md.title} style={styles.image} />
        </div>
      </section>

      {/* ===== SHADOW TRANSITION ===== */}
      <div style={styles.shadow}></div>

      {/*====== ABOUT ========*/}
      <div style={styles.about}> 
        <h2 style={styles.abouttitle}>About</h2>
        <p style = {styles.overview}>{md.overview}</p>
      </div>

      {/* ===== CAST SECTION ===== */}
      <section style={styles.castSection}>
        <h2 style={styles.sectionTitle}>Cast</h2>

        <div style={styles.castRow}>
          {cast.map((actor) => (
            <div key={actor.id} style={styles.castItem}>
              <img
                src={
                  actor.image
                    ? actor.image
                    : "https://via.placeholder.com/150?text=Actor"
                }
                alt={actor.name}
                style={styles.castImage}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.castImageHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, { transform: "scale(1)" })
                }
              />

              <p style={styles.castName}>{actor.name}</p>
            </div>
          ))}
        </div>
      </section>

      <MoviesRow title="Recommendation" category={`movieDetails/${movie.id}/recommendation`} />
    </div>
  );
}

/* 🎨 CSS-in-JS styles */
const styles = {
  page: {
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    overflow: "hidden",
  },

  hero: {
    display: "flex",
    alignItems: "center",
    height: "60vh",
    position: "relative",
  },

  info: {
    flex: "0 0 28%", // 👈 fixed width: 40%
    padding: "4% 4%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background:
      "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.4), transparent)",
    zIndex: 2,
  },


  title: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    lineHeight: "1.1",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#bbb",
    fontSize: "1.2rem",
    marginBottom: "10px",
  },

  streams: {
    color: "#bbb",
    fontSize: "1rem",
    marginBottom: "10px",
    marginLeft: "5px",
  },

  language: {
    color: "#bbb",
    marginLeft: "5px",
  },

  buttons: {
    display: "flex",
    gap: "25px",
    marginTop: "20px",
  },

  playButton: {
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "10px 35px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  },

  trailerButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid white",
    borderRadius: "25px",
    padding: "10px 35px",
    fontSize: "1rem",
    textDecoration: "none",
    transition: "0.3s",
    cursor: "pointer",
  },

  trailerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  trailerContainer: {
    position: "relative",
    width: "80%",
    height: "60%",
    backgroundColor: "black",
    borderRadius: "12px",
    overflow: "hidden",
  },

  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    color: "white",
    fontSize: "22px",
    border: "none",
    cursor: "pointer",
    zIndex: 10,
  },


  imageContainer: {
    flex: "0 0 72%", // 👈 fixed width: 60%
    position: "relative",
    height: "100%",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    filter: "brightness(80%)",
  },

  fadeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "200px",
    height: "100%",
    background:
      "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
    zIndex: 3,
  },

  shadow: {
    height: "120px",
    width: "100%",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
    marginTop: "-120px",
    position: "relative",
  },

  overview: {
    marginLeft : "3%",
  },

  abouttitle: {
    marginLeft: "1%",
  },

  castSection: {
    padding: "40px 40px 20px",
  },

  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "20px",
  },

  castImageHover: {
    transform: "scale(1.08)",
  },

  castRow: {
    display: "flex",
    gap: "25px",
    overflowX: "auto",
    paddingBottom: "10px",
  },

  castItem: {
    minWidth: "120px",
    textAlign: "center",
    cursor: "pointer",
  },

  castImage: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white",
    transition: "transform 0.3s ease",
  },

  castName: {
    marginTop: "8px",
    fontSize: "0.9rem",
    color: "#ddd",
  },

  centerText: { color: "white", textAlign: "center", marginTop: "30vh" },
  errorText: { color: "red", textAlign: "center", marginTop: "30vh" },
};

export default MovieDetails;
