const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post("/local/callback", passport.authenticate('local_login', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        console.log('req.user: '+JSON.stringify(req.user));
        res.redirect('/user/dash');
    });

router.get('/google/login',passport.authenticate('google_login',{scope: ['profile']}));

router.get('/google/callback',
    passport.authenticate('google_login', {
        scope: ['https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'],
        failureRedirect: '/login'
    }),(req, res) => {
        console.log('req.user: '+JSON.stringify(req.user));
        res.redirect('/user/dash');
});

module.exports = router;