const express = require('express');
const router = express.Router();

router.get('/dash', (req, res) => {
    console.log('req.user (redirect): '+JSON.stringify(req.user));
    res.render('dashboard',{title:'Community Booking System',user: req.user});
});

module.exports = router;