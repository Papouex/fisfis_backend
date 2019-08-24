const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const User = require('../models/user');
const Job = require('../models/job');
const multer = require('multer');
const Picture = require('../models/image');
//create
router.post('/register', function (req, res, next) {
  var user = new User();
  /*fname,lname,email,adress,password,tel,image */
  console.log(req.body.fname);

  user.fname = req.body.fname;
  user.lname = req.body.lname;
  user.email = req.body.email;
  user.adress = req.body.adress;
  user.password = req.body.password;
  user.tel = req.body.tel;
  user.image = req.body.image;
  user.type = req.body.type;
  user.save(function (err, data) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
      console.log(err);
    } else {
      res.json({ success: true, msg: "Utilisateur créé avec succès", obj: data.id });
    }
  });
});




router.post('/auth', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
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
            /*fname,lname,email,adress,password,tel,image */
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            adress: user.adress,
            tel: user.tel,
            image: user.image,
            type: user.type
          }
        })
      }
      else {
        return res.json({ success: false, msg: "Mot de passe incorrect" });
      }
    });


  });
});
//Update

router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (req.body.password && req.body.password.length < 50) {
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

//Get All
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
/* router.post('/test', function(req,res,next){
   for(let i=0;i<=25;i++)
   {
     var user = new User();
     user.fname    = "Papou"+i;
     user.lname    = "Pica"+i;
     user.email    = "papou"+i+"@gmail.com";
     user.adress = "Kram"+i;
     user.password = "password";
     user.tel = "2265942"+i;
     user.image = req.body.image;
     user.type = req.body 
   }
 })*/
//Find By Id
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
//Delete by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

router.post('/uploadphoto/:id', upload.single('image'), (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.file);
  console.log("none")

  var imgSRC = "http://localhost:4000/public/assets/uploads/" + req.file.filename;
  User.update({ "_id": req.params.id }, { "image": imgSRC }, function (err, user) {
    if (err) {
      return res.json({ success: false, msg: "Probleme update" })
    } else {
      return res.json({ success: true, user });
    }

  });
})

router.get('/nbrapp/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  let nbr = 0;
  Job.find(function (err, jobs) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {
      console.log(jobs.length);
      for (var i = 0; i < jobs.length; i++) {
        console.log(i);
        if (typeof jobs[i].users !== 'undefined' && jobs[i].users) {
        for (var j = 0; j < jobs[i].users.length; j++) {
          console.log(j);
          
            if (jobs[i].users[j].userId == req.params.id) {
              console.log("le " + jobs[i].users[j].userId);
              console.log("lee " + req.params.id);
              console.log("Trouve !")
              nbr++;
            }
         

        }
      }

      }

      res.json({ success: true, msg: "Nombre de users trouves", obj: nbr })
    }
  });
});

module.exports = router;