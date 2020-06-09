const express = require('express');
const router = express.Router();
const { ensureAuthenticate } = require('../config/auth');

// homepage
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/dashboard', ensureAuthenticate, (req,res) => {
    res.render('dashboard', {
        user : req.user
    });
});


module.exports = router;