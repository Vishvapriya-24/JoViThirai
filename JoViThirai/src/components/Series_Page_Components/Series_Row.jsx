import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const fetchSeries = async (category) => {
  const res = await axios.get(`${API}/series/${category}`);
  return res.data;
};

function Series_Row({ title, category, sliceFrom = 0, sliceTo = 20 }) {
  const navigate = useNavigate();

  const {
    data: series = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["series", category],
    queryFn: () => fetchSeries(category),
  });

  if (isLoading) return <p style={{ color: "white" }}>Loading {title}...</p>;
  if (isError) return <p style={{ color: "red" }}>{error.message}</p>;

  const visibleSeries = series.slice(sliceFrom, sliceTo);

  return (
    <>
      <style>{`
        .window {
          backgroud:black;
          height:100%;
        }

        .row-wrapper {
          background: black;
        }

        .row-title {
          color: white;
          font-size: 22px;
          font-weight: 600;
        }

        .row-container {
          display: flex;
          gap: 18px;
          padding: 20px 40px;
          overflow-x: auto;
          scroll-behavior: smooth;
        }

        .row-container::-webkit-scrollbar {
          display: none;
        }

        .poster-card {
          flex: 0 0 auto;
          width: 180px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .poster-card:hover {
          transform: scale(1.08);
        }

        .poster-img {
          width: 100%;
          border-radius: 12px;
        }
      `}</style>

      <div className="window">
        <div className="row-wrapper">
          <h2 className="row-title">{title}</h2>

          <div className="row-container">
            {visibleSeries.map((item) => (
              <div
                key={item.id}
                className="poster-card"
                onClick={() =>
                  navigate("/home/series/seriesDetails", { state: item })
                }
              >
                <img
                  src={item.poster}
                  alt={item.name}
                  className="poster-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Series_Row;
