import MoviesRow from "./MoviesRow";


function Movies() {
  const containerStyle = {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "20px",
    overflow: "hidden",
  };
    return(
      <div style={containerStyle}>
        <MoviesRow title="Now Playing" category="now-playing" />
        <MoviesRow title="Popular" category="popular" />
        <MoviesRow title="Top Rated" category="top_rated" />
        <MoviesRow title="Upcoming" category="upcoming" />
      </div>
    )
}

export default Movies;
