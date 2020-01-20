const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const User = require('../models/users');
const Pass = require('../models/passes');
const Precommand = require('../models/precommand');
const multer = require('multer');


//Inscription
router.post('/registertest', function (req, res, next) {
  var user = new User();
  user.fname = req.body.fname,
    user.lname = req.body.lname,
    user.email = req.body.email,
    user.password = req.body.password,
    user.phone_number = req.body.phone_number,
    user.ban = req.body.ban,
    user.command_no = req.body.command_no,
    user.exact_location = req.body.exact_location,
    user.picture_url = req.body.picture_url,
    user.prefered_lng=req.body.prefered_lng,
    user.zone = req.body.zone;
        user.save(function (err, data) {
          if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
          } else {

                  res.json({ success: true, msg: "Utilisateur créé avec succès", obj: x });
              }
          });
           
        
});

 //Inscription
router.post('/register', function (req, res, next) {
  var user = new User();
  user.fname = req.body.fname,
    user.lname = req.body.lname,
    user.email = req.body.email,
    user.password = req.body.password,
    user.phone_number = req.body.phone_number,
    user.ban = req.body.ban,
    user.command_no = req.body.command_no,
    user.exact_location = req.body.exact_location,
    user.picture_url = req.body.picture_url,
    user.prefered_lng=req.body.prefered_lng,
    user.zone = req.body.zone;
   var pass=req.body.pass;
   Pass.find({ "pass": pass }).exec( function (err, pass) {
    if (err) {
        console.log(err);
        res.json({ success: false, msg: "VIP Pass invalide" });
    } else {
        user.save(function (err, data) {
          if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
          } else {
            let x={
              userId:data.id,
              pass:pass
            }
            var precommande = new Precommand();
            precommande.name="Command_num_0";
            precommande.total=0;
            precommande.user=data.id;
            precommande.imageSrc="/uploads/categories/breakfast.png";
            precommande.products=[];
            precommande.save(function (err, data) {
              if (err) {
                  res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
              } else {
                  res.json({ success: true, msg: "Utilisateur créé avec succès", obj: x });
              }
          });
           
          }
        });
    }
})
});
 
//Authentification
router.post('/auth', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  User.getTravelerByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "L ' email entré ne correspond à aucun compte" });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 2678400
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone_number: user.phone_number,
            ban: user.ban,
            command_no: user.command_no,
            exact_location:user.exact_location,
            picture_url:user.picture_url,
            prefered_lng:user.prefered_lng,
            zone:user.zone
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
router.get('/', function (req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
//User today
router.get('/today',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  User.find({ 'createdAt': { $gte: today } }).exec(function (err, users) {
      if (err) {
          res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
      } else {
          res.json({ success: true, msg: "Success getting today users", obj: users });
      }
  })
})
//Get users nbre
router.get('/nbr',function (req, res, next){
  User.find().count(function(err, count){
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
  if (req.body.password) {
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
      if (err) return next(err);
      req.body.password = hash;
      User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    });
  }
  else {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
//Suppression
router.delete('/:id', function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json("Client supprimé avec succès");
  });

});
//Update ban
router.put('/ban/:userId',  function (req, res, next) {
  var userId = req.params.userId;
  var ban = req.body.ban;

  User.update({ '_id': userId },{$set:{'ban': ban }}, function (err, user) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "User banni", obj: user});
      }
  });
})
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/user/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
  }
})

var upload = multer({ storage: storage })

//Update
router.post('/image/:id',upload.single('image'),function(req, res) {
  var imgSRC = "/uploads/user/" + req.file.filename;
  User.update({ "_id": req.params.id }, { $set: { picture_url: imgSRC } }, function (err, user) {
    if (err) {
      return res.json({ success: false, msg: "Probleme update" })
    } else {
      return res.json({ success: true, obj:user });
    }

  });
})

//update zone
router.put('/zone/:userId', function (req, res, next) {
  var userId = req.params.userId;
  var zone = req.body.zone;

  User.update({ '_id': userId },{$set:{zone: zone }}, function (err, user) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Zone mis a jour", obj: user});
      }
  });
})
//update zone
router.put('/cono/:userId', function (req, res, next) {
  var userId = req.params.userId;
  var command_no = req.body.command_no;

  User.update({ '_id': userId },{$set:{command_no: command_no }}, function (err, user) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Command number mis a jour", obj: user});
      }
  });
})

//update exact location
router.put('/exact/:userId', function (req, res, next) {
  var userId = req.params.userId;
  var exact = req.body.exact_location;

  User.update({ '_id': userId },{$set:{exact_location: exact }}, function (err, user) {
    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Exact location mis a jour", obj: user});
      }
  });
})

//update prefered language
router.put('/lng/:userId',  function (req, res, next) {
  var userId = req.params.userId;
  var lng = req.body.prefered_lng;

  User.update({ '_id': userId },{$set:{prefered_lng: lng }}, function (err, user) {
    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Language mis a jour", obj: user});
      }
  });
})

module.exports = router;
