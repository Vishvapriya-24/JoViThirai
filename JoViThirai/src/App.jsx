import React, { useState, useEffect, createContext } from "react";
import Log_Page from "./components/Log_Page_Components/Log_Page";
import Welcome from "./components/Movies_Page_Components/Welcome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage  from "./components/Movies_Page_Components/HomePage";
import Contact from "./components/Movies_Page_Components/Contact";
import ProfilePage from "./components/Movies_Page_Components/ProfilePage";
import MovieDetails from "./components/Movies_Page_Components/MovieDetails";
import Series from "./components/Series_Page_Components/Series";
import SeriesDetails from "./components/Series_Page_Components/SeriesDetails";
import { MoviePage } from "./components/Movies_Page_Components/MoviePage";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResult from "./components/Movies_Page_Components/SearchResult";
import FullMoviePage from "./components/Movies_Page_Components/FullMoviePage";

export const MyContext = createContext();

function App() {
  return (
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Log_Page/>} />
        <Route path="/home" element={<Welcome />}>
          <Route path="front" element={<MoviePage/ >}/>
          <Route path="movies" element={<ProtectedRoute><FullMoviePage /></ProtectedRoute>} />
          <Route path="contact" element={<Contact />} />
          <Route path="series" element={<Series />} />
          <Route path='search' element={<SearchResult/>}/>
          <Route path="series/seriesDetails" element={<SeriesDetails />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="movies/movieDetails" element={<MovieDetails />} />
        </Route>

      </Routes>  
  );
}

export default App;
