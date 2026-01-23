import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieSkeleton from "./MovieSkeleton";

const fetchMovies = async (category) => {
  const res = await axios.get(`http://localhost:8000/movies/${category}`);
  return res.data;
};

const MoviesRow = ({ title, category }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null); // ✅ new state
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Movies", category],
    queryFn: () => fetchMovies(category),
  });

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 1 * 220;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const extractVideoId = (url) => {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  };

  if (isLoading) {
  return (
    <div style={{ backgroundColor: "#000", padding: "20px 0" }}>
      <h2 style={{ color: "#fff", marginLeft: "40px", marginBottom: "10px" }}>
        {title}
      </h2>
      <MovieSkeleton />
    </div>
  );
}

  if (isError)
    return (
      <h3 style={{ color: "red", marginLeft: "20px" }}>
        Error loading {title}: {error.message}
      </h3>
    );

  const styles = {
    section: {
      marginBottom: "40px",
      position: "relative",
      padding: "0 0px",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#fff",
      marginBottom: "10px",
      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
    },
    scrollContainer: {
      display: "flex",
      overflowX: "hidden",
      gap: "25px",
      paddingBottom: "20px",
    },
    poster: {
      width: "200px",
      height: "260px",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    arrowButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      border: "none",
      color: "white",
      padding: "10px",
      borderRadius: "50%",
      cursor: "pointer",
      zIndex: 10,
    },
    leftArrow: { left: "20px" },
    rightArrow: { right: "20px" },

    // 🎥 trailer styles
    trailerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
      position: "relative",
    },
    trailerFrame: {
      width: "80%",
      height: "450px",
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 0 20px rgba(255,255,255,0.2)",
    },
    closeBtn: {
      marginTop: "15px",
      backgroundColor: "#ff3333",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: "16px",
    },
  };

  return (
    <>
      <div style={styles.section}>
        <h2 style={styles.title}>{title}</h2>

        {/* Left arrow */}
        <button
          style={{ ...styles.arrowButton, ...styles.leftArrow }}
          onClick={() => handleScroll("left")}
        >
          <AiOutlineLeft size={26} />
        </button>

        {/* Movie List */}
        <div style={styles.scrollContainer} ref={scrollRef}>
          {data?.slice(0, 20).map((m) => (
            <img
              key={m.id}
              src={m.poster}
              alt={m.title}
              style={styles.poster}
              onClick={() => {
                navigate(`/home/movies/movieDetails`, { state: m })
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.07)";
                e.target.style.boxShadow =
                  "0 4px 10px rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          style={{ ...styles.arrowButton, ...styles.rightArrow }}
          onClick={() => handleScroll("right")}
        >
          <AiOutlineRight size={26} />
        </button>
      </div>

      {/* 🎥 Trailer Player */}
      {selectedTrailer && (
        <div style={styles.trailerContainer}>
          <iframe
            src={`https://www.youtube.com/embed/${extractVideoId(
              selectedTrailer
            )}?autoplay=1&mute=1`}
            style={styles.trailerFrame}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Movie Trailer"
          ></iframe>
          <button style={styles.closeBtn} onClick={() => setSelectedTrailer(null)}>
            ✖ Close
          </button>
        </div>
      )}
    </>
  );
};

export default MoviesRow;
