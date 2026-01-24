const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

require('dotenv').config();
require('./Database'); 
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { signup, signin } = require('./log_page');
const { carousel, getNowPlayingMovies, getPopularMovies,getTopRatedMovies, getUpCommingMovies, getMovieTrailer, getRecommendation, getAllFullMovie } = require('./movies_page');
const { createProfile, updateProfile, getProfile } = require('./Requests/ProfileRequest');
const verifyToken = require('./authMiddleware');
const {getSeries, getSeriesDetails, getSeriesCast, getSeriesRecommendation} = require('./series_page');


const app = express();
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "https://jovithirai.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get("/test-db", async (req, res) => {
  const [rows] = await db.query("SHOW TABLES");
  res.json(rows);
});

app.get('/check-auth', verifyToken, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

// Authentication
app.post('/signup', signup);
app.post('/signin', signin);

app.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    res.json({ msg: "Logged out successfully" });
});

//movies
app.get('/carousel', carousel);
app.get('/movies/now-playing', getNowPlayingMovies)
app.get('/movies/popular', getPopularMovies)
app.get('/movies/top_rated', getTopRatedMovies)
app.get('/movies/upcoming', getUpCommingMovies)
app.get('/movies/movieDetails/:movieId', getMovieTrailer);
app.get('/movies/movieDetails/:movieId/recommendation', getRecommendation);
app.get('/movies/fullmovie',getAllFullMovie)

//series
app.get("/series/:region", getSeries);
app.get("/series/seriesDetails/:seriesId",getSeriesDetails);
app.get("/series/seriesDetails/:seriesId/recommendation",getSeriesRecommendation);

// Profile routes
app.post('/profile/create', createProfile);   
app.put('/profile/:user_id',upload.single("profile_pic"), updateProfile);  
app.get('/profile/:user_id', getProfile);     

app.listen(process.env.PORT, () => {
    console.log("Jovithirai API is running");
});
