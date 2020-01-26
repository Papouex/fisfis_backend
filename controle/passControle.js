const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Pass = require('../models/passes');
var crypto = require('crypto');
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
}
//Ajouter destination
router.post('/ajouter', function (req, res, next) {
    var pass = new Pass();
    var string = randomValueHex(4);
    pass.pass = string;
    pass.creator = req.body.creator;
    pass.isActive = req.body.isActive;

    pass.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Pass créée avec succès", obj: data.id });
        }
    });
});


//Read all
router.get('/', function (req, res, next) {
    Pass.find().sort('-createdAt').exec(function (err, passes) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting passes", obj: passes });
        }
    });
});
//Modification
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Pass.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Get by id
router.get('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Pass.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Delete
router.delete('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Pass.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Theme supprimé avec succès");
    });

});

//update pass user
router.put('/user/:pass',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const pass = req.params.pass;
    const userId = req.body.userId;
    Pass.update({ "pass": pass }, { "user": userId,"isActive":false }, function (err, pass) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success updating pass user", obj: pass });
        }
    })
  
});
//get by user
router.get('/user/:userId', function (req, res, next) {
    var userId = req.params.userId;
    Pass.find({ "creator": userId }).exec(function (err, passes) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting user passes", obj: passes });
        }
    });
});

module.exports = router;