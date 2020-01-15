const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const General = require('../models/general');
//Ajouter general
router.post('/ajouter', function (req, res, next) {
    var general = new General();
    general.opening_hour=req.body.opening_hour;
    general.closing_hour=req.body.closing_hour;
    general.locations_list=req.body.locations_list;
    

    general.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "General créé avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', function (req, res, next) {
    General.find().sort('-createdAt').limit(1).exec(function (err, generals) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting general", obj: generals });
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
    General.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    General.findById(req.params.id, function (err, post) {
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
    General.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Destination supprimé avec succès");
    });

});
//Update locations
router.put('/location/:generalId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var generalId = req.params.generalId;
    var locations = req.body;
    General.update(
      { _id: generalId },
      { $addToSet: { locations_list: { $each: locations } } }, function (err, general) {
        if (err)
        { 
          res.json({ success: false, msg: "Probleme" });
        }else{
        res.json({ success: true, msg: "Location créé avec succès", obj: general });
        }
  
      })
   
  });
  
  //delete tag
  router.put('/loc/:generalId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var generalId = req.params.generalId;
    var locationName = req.body.locationName;
    General.update(
      {'_id': generalId},
      {$pull: { locations_list: locationName  }}
    ,
      function (err, general) {
        if (err)
        { 
          console.log(err);
          res.json({ success: false, msg: "Probleme" });
        }else{
        res.json({ success: true, msg: "Location removed successfuly", obj: general });
        }
      });
  
  });

module.exports = router;