import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../style/SearchResult.module.css"; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // your TMDB key

function SearchResult() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!query) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [movieRes, tvRes, personRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
          ),
          axios.get(
            `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`
          ),
          axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`
          ),
        ]);

        setMovies(movieRes.data.results || []);
        setTvShows(tvRes.data.results || []);
        setArtists(personRes.data.results || []);
      } catch (err) {
        console.error("TMDB fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [query]);

  // Only artists with images (no empty box)
  const filteredArtists = artists.filter((person) => person.profile_path);

  //  Check for "no results" (artists + movies + tv)
  const noResults =
    !loading &&
    movies.length === 0 &&
    tvShows.length === 0 &&
    filteredArtists.length === 0;

  return (
    <div className={`${style.searchContainer}`}>
      <h3 className={`${style.searchHeading} mb-4`}>
        Search results for: "{query}"
      </h3>

      {loading && <p>Loading...</p>}

      {/* Artists – show only if at least one artist WITH IMAGE */}
      {!loading && filteredArtists.length > 0 && (
        <section className={`${style.sectionWrapper} mb-5`}>
          <h5 className={`${style.sectionTitle} text-warning`}>Artists</h5>
          <div className={`${style.artistGrid} d-flex flex-wrap gap-4`}>
            {filteredArtists.slice(0, 8).map((person) => (
              <div
                key={person.id}
                className={`${style.artistCard} text-center`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                  className={`${style.artistImg} rounded-circle mb-2`}
                />
                <p className={`${style.artistName} small mb-0`}>
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Movies – this will show even if artist section is empty */}
      {!loading && movies.length > 0 && (
        <section className={`${style.sectionWrapper} mb-5`}>
          <h5 className={`${style.sectionTitle} text-warning`}>Movies</h5>
          <div className="row">
            {movies.slice(0, 8).map((movie) => (
              <div key={movie.id} className="col-6 col-md-3 mb-4">
                <div
                  className={`${style.movieCard} card bg-dark text-light h-100 border-0`}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    onClick={() => {
                navigate(`/home/movies/movieDetails`, { state: movie })
              }}
                    alt={movie.title}
                    className={`${style.movieImg} card-img-top rounded`}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title mb-1 text-truncate">
                      {movie.title}
                    </h6>
                    <p className="text-muted small mb-0">
                      {movie.release_date
                        ? movie.release_date.split("-")[0]
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TV Shows – same logic */}
      {!loading && tvShows.length > 0 && (
        <section className={`${style.sectionWrapper} mb-5`}>
          <h5 className={`${style.sectionTitle} text-warning`}>TV Shows</h5>
          <div className="row">
            {tvShows.slice(0, 8).map((tv) => (
              <div key={tv.id} className="col-6 col-md-3 mb-4">
                <div
                  className={`${style.tvCard} card bg-dark text-light h-100 border-0`}
                >
                  <img
                    src={
                      tv.poster_path
                        ? `https://image.tmdb.org/t/p/w300${tv.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    onClick={() => {
                navigate(`/home/movies/movieDetails`, { state: tv })
              }}
                    alt={tv.name}
                    className={`${style.tvImg} card-img-top rounded`}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title mb-1 text-truncate">{tv.name}</h6>
                    <p className="text-muted small mb-0">
                      {tv.first_air_date
                        ? tv.first_air_date.split("-")[0]
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No Results – only when artist, movie, tv ALL empty */}
      {noResults && <p>No search result available.</p>}
    </div>
  );
}

export default SearchResult;
