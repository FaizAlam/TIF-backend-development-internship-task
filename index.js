const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
var MemoryStore = require('memorystore')(expressSession)
const passport = require('passport');
const flash = require('connect-flash');
const userRoute = require('./controller/userRoutes');
const schoolRoute = require('./controller/schoolRoutes');
const studentRoute = require('./controller/studentRoutes');
const roleRoute = require('./controller/rolesRoutes');


const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const mongoURI = process.env.URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, }, ).then(() => console.log("Connected !"), );

app.use(cookieParser());

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});

app.use('/user', userRoute);
app.use('/role', roleRoute);
app.use('/student', studentRoute);
app.use('/school', schoolRoute);

// app.use("/route",require('./controller/route'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));