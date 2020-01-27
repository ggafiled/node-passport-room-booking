const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get('/', (req, res) => {
    if(req.user){
        res.redirect('/user/dash')
    }else{
        res.redirect('/login')
    }
});

router.get('/login',(req, res) => {
    if(req.user){
        res.redirect('/user/dash')
    }else{
        res.render('login', {
            title: 'Community Booking System'
        });
    }
});

router.get('/register', (req, res) => res.send('User register page'));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

router.get('/authentication/isauthenticated', function (req, res) {
    console.log(req.isAuthenticated());
    res.status(201).send({
        "isauthenticated": req.isAuthenticated(),
        "user": req.session.passport.user
    });

})

module.exports = router;