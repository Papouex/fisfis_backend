const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Ads = require('../models/ads');
const multer = require('multer');
//Ajouter destination
router.post('/ajouter', function (req, res, next) {
    var ads = new Ads();
    ads.title=req.body.title;
    ads.second_title=req.body.second_title;
    ads.third_title=req.body.third_title;
    ads.imageSrc=req.body.imageSrc;
    
    ads.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Ad créé avec succès", obj: data.id });
        }
    });
});
//Read one
router.get('/', function (req, res, next) {
    Ads.find().sort('-createdAt').limit(1).exec(function (err, ads) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting ad", obj: ads });
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
    Ads.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Ads.findById(req.params.id, function (err, post) {
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
    Ads.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Ad supprimé avec succès");
    });

});

//MULTER FOR FILE UPLOAD CONGIF
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/ad/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
    }
});
var upload = multer({ storage: storage })
//Upload ad image
router.post('/imageup', upload.single('image'), function (req, res) {
    var imgSRC = "/uploads/ad/" + req.file.filename;
    return res.json({success: true,image:imgSRC})
});

//Update ad image
router.post('/image/:id', upload.single('image'), function (req, res) {
    var imgSRC = "/uploads/ad/" + req.file.filename;
    Ads.update({ "_id": req.params.id }, { $set: { 'imageSrc': imgSRC } }, function (err, ad) {
        if (err) {
            return res.json({ success: false, msg: "Probleme update" })
        } else {
            return res.json({ success: true, obj:ad });
        }

    });
});
module.exports = router;