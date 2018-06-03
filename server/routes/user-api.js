var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

router.post('/find-by-username/:username', function (req, res, next) {
    User.find({username: req.params.username}, function (err, doc) { 
        if (err) return next(err);
        res.json(doc);
    });
});

module.exports = router;
