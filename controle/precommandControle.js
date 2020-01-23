const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Precommand = require('../models/precommand');
const multer = require('multer');
//Ajouter precommande
router.post('/ajouter', function (req, res, next) {
    var precommande = new Precommand();
    precommande.name=req.body.name;
    precommande.total=req.body.total;
    precommande.imageSrc=req.body.imageSrc;
    precommande.user=req.body.user;
    precommande.products=req.body.products;
    
     precommande.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Precommande créée avec succès", obj: data.id });
        }
    });
});
//Get by user
router.get('/:userId', function (req, res, next) {
    var userId=req.params.userId;
    Precommand.find({user:userId}).sort('-createdAt').exec(function (err, precommands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting categories", obj: precommands });
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
    Precommand.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Get by id
router.get('/by/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Precommand.findById(req.params.id, function (err, post) {
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
    Precommand.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Categorie supprimée avec succès");
    });

});



module.exports = router;