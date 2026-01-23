// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

require('dotenv').config();
require('./Database'); // just runs the db connection
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { signup, signin } = require('./log_page');
const { carousel, getNowPlayingMovies, getPopularMovies,getTopRatedMovies, getUpCommingMovies, getMovieTrailer, getRecommendation, getAllFullMovie } = require('./movies_page');
const { createProfile, updateProfile, getProfile } = require('./Requests/ProfileRequest');
const verifyToken = require('./authMiddleware');
const {getSeries, getSeriesDetails, getSeriesCast, getSeriesRecommendation} = require('./series_page');


const app = express();
app.use(cookieParser());

app.use(cors({origin:"http://localhost:5173",credentials:true}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get('/check-auth', verifyToken, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});


// Routes
app.post('/signup', signup);
app.post('/signin', signin);

app.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false // HTTPS irundha true
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
//app.get('/series/:category', getSeries);
app.get("/series/:region", getSeries);
app.get("/series/seriesDetails/:seriesId",getSeriesDetails);
app.get("/series/seriesDetails/:seriesId/recommendation",getSeriesRecommendation);

// Profile routes
app.post('/profile/create', createProfile);   // create new profile
app.put('/profile/:user_id',upload.single("profile_pic"), updateProfile);   // update existing profile (partial allowed)
app.get('/profile/:user_id', getProfile);     // fetch profile by user_id




app.listen(process.env.PORT, () => {
    console.log("Flimpire API is running");
});
