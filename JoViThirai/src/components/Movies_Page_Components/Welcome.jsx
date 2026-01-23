import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import Plans from "./Plans";
import { Outlet } from "react-router-dom";
import FloatingNav from "./FloatingNav";

function Welcome() {
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // 🔒 Disable background scroll when modal open

  useEffect(() => {
    fetch("http://localhost:8000/check-auth", {
      credentials: "include" // 🔥 cookie must go
    })
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
        } else {
          navigate("/"); // 👈 signin page
        }
      })
      .catch(() => navigate("/"));
  }, []);

  // ⛔ while checking token
  useEffect(() => {
    document.body.style.overflow = showSubscribe ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSubscribe]);

  // ⌨️ ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSubscribe(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSelectPlan = (planName) => {
    console.log("Plan selected:", planName);
    // 🔗 payment / API logic later
    setShowSubscribe(false);
  };

  return (
    <div>
      {/* 🔹 Top Navigation */}
      <Navigation
        setShowSubscribe={setShowSubscribe}
        setShowSettings={setShowSettings}
      />

      {/* 🔹 Page Content */}
      <Outlet />

      {/* 🔥 SUBSCRIBE MODAL */}
      {showSubscribe && (
        <div
          onClick={() => setShowSubscribe(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999, // 🔥 VERY IMPORTANT
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "30px",
              minWidth: "320px",
              maxWidth: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Choose a Plan
            </h2>

            <Plans onSelectPlan={handleSelectPlan} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
