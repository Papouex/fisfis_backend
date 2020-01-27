const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Admin = require('../models/admin');

//Inscription
router.post('/register', function (req, res, next) {
  var admin = new Admin();

    admin.name=req.body.name;
    admin.email = req.body.email,
    admin.password = req.body.password, 
    admin.delivery=req.body.delivery;

  admin.save(function (err, data) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {
      console.log(data);
      res.json({ success: true, msg: "Admin créé avec succès", obj: data.id });
    }
  });
});
//GET ADMINS IDS
router.get('/adid',function(req, res, next){
  Admin.find(function (err, admins) {
      if (err) {
          res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
      } else {
          var adminsids=[];
          admins.forEach(item=>{
             adminsids.push(item._id);
          })
          res.json({ success: true, msg: "Success getting trips", obj: adminsids });
      }
  });
})
//Authentification
router.post('/auth', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  Admin.getAdminByEmail(email, (err, admin) => {
    if (err) throw err;
    if (!admin) {
      return res.json({ success: false, msg: "L ' email entré ne correspond à aucun compte" });
    }
    Admin.comparePassword(password, admin.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(admin.toJSON(), config.secret, {
          expiresIn: 267840
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          admin: {
            email: admin.email,
            name:admin.name,
            delivery:admin.delivery
          }
        })
      }
      else {
        return res.json({ success: false, msg: "Mot de passe incorrect" });
      }
    });


  });
});
//GET ALL
router.get('/',  function (req, res, next) {
  Admin.find(function (err, admins) {
    if (err) return next(err);
    res.json(admins);
  });
});
//Modification
router.put('/:id',  function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  if (req.body.password) {
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
      if (err) return next(err);
      req.body.password = hash;
      Admin.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    });
  }
  else {
    Admin.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});
//Recuperation by id
router.get('/:id', function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  Admin.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
//Suppression
router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  Admin.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json("Admin supprimé avec succès");
  });

});

module.exports = router;
