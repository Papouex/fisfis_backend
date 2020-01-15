const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Promo = require('../models/promotions');
//Ajouter promotion
router.post('/ajouter', function (req, res, next) {
    var promotion = new Promo();
    promotion.promo=req.body.promo;
    promotion.isActive=req.body.isActive;
    promotion.percentage=req.body.percentage;
    promotion.users=req.body.users;

    promotion.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Promotion créé avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', function (req, res, next) {
    Promotion.find().sort('-createdAt').exec(function (err, promotions) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting promotions", obj: promotions });
        }
    });
});
//Get forms nbr
router.get('/nbr',function (req, res, next){
    Promotion.find().count(function(err, count){
      if(err) return next(err);
      res.json(count);
  });
})
//Modification
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Promotion.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Promotion.findById(req.params.id, function (err, post) {
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
    Promotion.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Destination supprimé avec succès");
    });

});
//Submit user to promo
router.put('/user/:promoId', function(req, res, next) {
    const promoId = req.params.promoId;
    const userId=req.body.userId;
    Promotion.update(
      { _id: promoId, 'users.user':{$ne:userId} },
      { $addToSet: { users: { user: userId} } }, function (err, promo) {
        if (err) {
          console.log(err);
          res.json({success:false, msg : "Error"});
        }else{
        res.json({success:true,msg:"Success adding user to promo",obj:user});
        }
  
      })
});

module.exports = router;