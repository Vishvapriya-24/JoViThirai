import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap-icons/font/bootstrap-icons.css";
const API = import.meta.env.VITE_API_URL;

function Navigation({ setShowSubscribe, setShowSettings }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const searchRef = useRef(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleOpenSettings = (e) => {
    e.preventDefault();
    navigate("/home/settings/account", { state: { from: location.pathname } });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
      const updated = [query, ...stored.filter((i) => i !== query)].slice(0, 6)
      console.log(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      setRecentSearches(updated);

      navigate(`/home/search?q=${encodeURIComponent(query)}`);

      setQuery("");
      setShowSearch(false);
    }
  };
  const handleLogout = async () => {
  try {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include"
    });

    navigate("/"); // 👈 signin / front page
  } catch (err) {
    console.error("Logout failed", err);
  }
};




  // Escape key closes search
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
      <Container fluid>
        {/* Small screen hamburger + brand */}
        <div className="d-flex align-items-center d-lg-none">
          <Navbar.Toggle aria-controls="offcanvasNavbar" className="me-2" onClick={handleShow} />
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-light mb-0">
            JoViThirai
          </Navbar.Brand>
        </div>

        {/* Large screen brand */}
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-warning d-none d-lg-block">
          JoViThirai
        </Navbar.Brand>

        {/* Large screen Nav Links */}
        <Navbar.Collapse id="main-navbar" className="d-none d-lg-flex">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home/front">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/home/series">Series</Nav.Link>
            <Nav.Link as={NavLink} to="/home/movies">Movies</Nav.Link>
            <Nav.Link as={NavLink} to="/home/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Right Section (Always visible) */}
        <div className="d-flex align-items-center ms-auto">
          {/* Search box */}
          {showSearch && (
            <div className="position-relative me-3">
              <Form
                className="me-3"
                style={{ minWidth: "200px" }}
                onSubmit={handleSearchSubmit}
              >
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" variant="primary">
                    Go
                  </Button>
                </InputGroup>
              </Form>
              {(recentSearches.length > 0 || query.trim()) && (
                <div
                  className="position-absolute mt-1"
                  style={{
                    width: "100%",
                    background: "rgba(40,40,40,0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    zIndex: 10,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {recentSearches.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      className="text-light px-3 py-2 hover-bg"
                      style={{ cursor: "pointer", fontSize: "0.9rem" }}
                      onClick={() => {
                        navigate(`/home/search?q=${encodeURIComponent(item)}`);
                        setShowSearch(false);
                      }}
                    >
                      <i className="bi bi-clock-history me-2 text-warning"></i>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>)}

          {/* Icons with spacing */}
          <Nav.Link
            href="#"
            className="me-3"
            onClick={(e) => {
              e.preventDefault();
              setShowSearch((prev) => !prev);
            }}
          >
            <i className="bi bi-search text-light" style={{ fontSize: "1.2rem" }}></i>
          </Nav.Link>

          <NavDropdown
            title={<i className="bi bi-person-circle text-light" style={{ fontSize: "1.2rem" }}></i>}
            id="user-dropdown"
            align="end"
            className="me-3"
          >
            <NavDropdown.Item as={NavLink} to="/home/profile">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Logout
            </NavDropdown.Item>          </NavDropdown>

          <Button
            variant="warning"
            className="fw-semibold text-dark"

            onClick={() => {
              console.log("SUBSCRIBE BUTTON CLICKED");
              setShowSubscribe(true)
            }}
          >
            Subscribe
          </Button>
        </div>

        {/* Small Screen Drawer with reduced width */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          show={show}
          onHide={handleClose}
          className="d-lg-none"
          style={{ width: "250px" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold">
              Flimpire
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={NavLink} to="/home/front" onClick={handleClose}>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/home/series" onClick={handleClose}>Series</Nav.Link>
              <Nav.Link as={NavLink} to="/home/movies" onClick={handleClose}>Movies</Nav.Link>
              <Nav.Link as={NavLink} to="/home/contact" onClick={handleClose}>Contact</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Navigation;
