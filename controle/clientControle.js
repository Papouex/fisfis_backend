const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Client = require('../models/client');
const ClientProfile=require('../models/clientProfile');

const multer = require('multer');


//Inscription
router.post('/register', function(req, res, next) {
    var client = new Client();
    console.log(req.body.pm);
    client.pm = req.body.pm;
    client.fname    = req.body.fname;
    client.lname    = req.body.lname;
    if(req.body.pm) {
      client.name    = req.body.name;
      client.mat_fis = req.body.mat_fis;
    } 
    
       
    client.email    = req.body.email;
    client.adress = req.body.adress;
    client.password = req.body.password;
    client.tel = req.body.tel;
    client.image = req.body.image;
    client.type = req.body.type;
    if(req.body.fax !=='' || req.body.fax == null)
      client.fax = req.body.fax;
    client.save(function(err,data){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
          console.log(data);
            res.json({success:true, msg :"Client créé avec succès", obj : data.id});
        } 
    });
});



//Authentification
router.post('/auth', function(req, res, next) {
  const email = req.body.email ;
  const password = req.body.password;
      
  Client.getClientByEmail(email, (err, client) =>{
      if(err) throw err ;
      if(!client){
          return res.json({success : false, msg : "L ' email entré ne correspond à aucun compte"});
      }
      Client.comparePassword(password, client.password, (err, isMatch)=>{
      if(err) throw err ;
      if(isMatch){
          const token = jwt.sign(client.toJSON(), config.secret, {
              expiresIn: 2678400 
          });
          res.json({
              success : true,
              token : 'JWT '+token,
              client: {
                  /*pm,name,mat_fis,fname,lname,email,adress,password,tel,fax,image */
                  pm : client.pm,
                  name : client.name,
                  mat_fis : client.mat_fis,
                  fname : client.fname,
                  lname : client.lname,
                  email : client.email,
                  adress: client.adress,
                  tel : client.tel,
                  fax : client.fax,
                  image : client.image,
                  type : client.type
              }
          })
      }
      else{
          return res.json({success : false, msg : "Mot de passe incorrect"}); 
      }
      });

      
  });
});
//GET ALL
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Client.find(function (err, clients) {
    if (err) return next(err);
    res.json(clients);
  });
});
//Modification
router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: 'Id is invalid '+req.params.id
      });
    }
    if(req.body.password){
      bcrypt.hash(req.body.password, null , null , function(err,hash){
          if(err) return next(err);
            req.body.password = hash;
            Client.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if (err) return next(err);      
              res.json(post);
            });
                      });  
         }
else{
Client.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
  if (err) return next(err);      
  res.json(post);
});
}
});
//Recuperation by id
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: 'Id is invalid '+req.params.id
      });
    }
    Client.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  //Suppression
  router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
          message: 'Id is invalid '+req.params.id
        });
      }
        Client.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json("Client supprimé avec succès");
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
      var imgSRC="http://localhost:4000/public/assets/uploads/"+req.file.filename;
      //this.baseUrl+"/public/assets/uploads/"+this.user.image
     Client.update({"_id": req.params.id},{"image":imgSRC},function(err, client){
      if(err){
         return res.json({success:false, msg:"Probleme update"})
      }else{
      return res.json({success:true, client});
      }
      
    });
})

router.post('/uploadcouverture/:id', upload.single('image'), (req, res) => {
  var imgSRC="http://localhost:4000/public/public/assets/uploads/"+req.file.filename;
  //this.baseUrl+"/uploads/"+this.user.image
 ClientProfile.update({"clientId": req.params.id},{"couverture":imgSRC},function(err, client){
  if(err){
     return res.json({success:false, msg:"Probleme update"})
  }else{
  return res.json({success:true, client});
  }
  
});
})

router.post('/uploadgallery/:id',upload.array("uploads[]", 10), (req, res) => {
  console.log(req.files);
  let error=false;

  for(let i=0;i<req.files.length;i++)
  {
    ClientProfile.update(
      { "clientId": req.params.id },
      { $push: { img_links:"http://localhost:4000/public/assets/uploads/"+req.files[i].filename } }, function(err, profile){
        if(err){
          error=true;
          //res.json({success:false, msg:"Probleme update"})
       }else{
            //res.json({success:true, profile});
            error=false;
       }
      }
   )

  }
  
  if(!error)
  {
    return res.json({success:true});
  }else{
    return res.json({success:false, msg:"Probleme update"});
  }

})
module.exports = router;