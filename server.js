'use strict';
const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require('connect-flash');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const promisify = require(`util`).promisify;
const path = require('path');
var methodOverride = require('method-override');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const format = require('string-format');
const hbs = require('hbs');
const routeController = require('./config/isAuth');
const TAG = "main";
require('dotenv').config()
require('./config/passport')(passport);

const PORT = process.env.PORT || 5200;

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname,'/public/views/partials/'));
app.set('layout', path.join(__dirname,'/public/views/partials/layout.hbs'));

// body parser and cookieParser
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000}));
app.use(bodyParser.json({ limit: '50mb', parameterLimit: 100000}));
app.use(cookieParser(process.env.COOKIE_KEY));
// Express session
app.use(
  session({
    name: '_redisPractice',
    secret: process.env.COOKIE_KEY,
    resave: true,
    saveUninitialized: true,
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })
  })
);
app.use(methodOverride('_method'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// 	req.login = promisify(req.login, req);
// 	next();
// });

// Global variables
app.all('*',function(req, res, next) {
  // console.log(format("{} : req user {} time {}",TAG,req.user,Date.now()));
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Request-Headers","*");
  res.header("Access-Control-Allow-Methods","GET, POST, DELETE, PUT, OPTIONS");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Cache-Control', 'private');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

// Route
app.use('/',require('./route/normal'));

app.use('/api/auth',require('./route/auth'))

app.use('/user',require('connect-ensure-login').ensureLoggedIn(),require('./route/user')); //require('connect-ensure-login').ensureLoggedIn()

app.listen(PORT, console.log(`Server started on port ${PORT}`));