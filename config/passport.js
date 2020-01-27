const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const bcrypt = require('bcryptjs');
var db = require('./db');
const format = require('string-format');
var TAG = "passport";


module.exports = function (passport) {

  passport.use('local_login', new LocalStrategy({
    usernameField: 'u_email',
    passwordField: 'u_pwd',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    console.log('user email: '+username);
    console.log('user pwd: '+password);
    if (!username || !password) {
      return done(null, false, req.flash('message', 'All fields are required.'));
    }
    await db.query("SELECT user.* FROM user WHERE user.u_email=? LIMIT 1", [username], function (err, results) {

      if (err) {
        return done(err);
      }

      if (!results.length) {
        return done(null, false);
      }

      console.log(format("{} : passport check user in db get {}", TAG, JSON.stringify(results)));
      bcrypt.compare(password, results[0].u_pwd, function (err, bcryptCompare) {
        if (err) {
          return done(null, false);
        }
        if (!bcryptCompare) {
          return done(null, false);
        }

        console.log('user: ' + results[0].uuid);
        return done(null, results[0]);
      });
    });

  }));

  passport.use('google_login',new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5200/api/auth/google/callback",
    passReqToCallback   : true
  }, async (request, accessToken, refreshToken, profile, done) => {
    await db.query("SELECT user.* FROM user WHERE user.uuid=? LIMIT 1", [profile.id], function (err, results) {

      if (err) {
        return done(err);
      }

      if (!results.length) {
        return done(null, false);
      }

      console.log(format("{} : passport check user in db get {}", TAG, JSON.stringify(results)));
      return done(null, results[0]);
    });
  }
));

  passport.serializeUser(function (user, done) {
    console.log(format("{} : passport serializeUser id {}", TAG, JSON.stringify(user)));
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    console.log(format("{} : passport deserializeUser id {}", TAG, JSON.stringify(user)));
    await db.query("SELECT user.* FROM user WHERE user.uuid=? LIMIT 1", [user.uuid], function (err, results) {
      done(err, results[0]); //results[0]
    });
  });

}