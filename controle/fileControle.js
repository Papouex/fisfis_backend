const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const multer = require('multer');
const Picture = require('../models/image');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  var upload = multer({ storage: storage })

router.post('/uploadphoto/:id', upload.single('picture'), (req, res) => {
    console.log(req.body);
    if (!req.file) {
        console.log("No file received");
        
      } else { 
        console.log('file: ',req.file);
      }
   /* var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');
 var finalImg = {contentType: req.file.mimetype,image:  new Buffer(encode_image, 'base64')};
     Picture.insertOne(finalImg, (err, result) => {
    console.log(result)
    if (err) return console.log(err)
    console.log('saved to database')
    //res.redirect('/')
      })*/
})

router.get('/photos', (req, res) => {
    Picture.find().toArray((err, result) => {
          const imgArray= result.map(element => element._id);
                console.log(imgArray);
       if (err) return console.log(err)
       res.send(imgArray)
     
      })
    });


router.get('/photo/:id', (req, res) => {
    var filename = req.params.id;         
    Picture.findOne({'_id': ObjectId(filename) }, (err, result) => {
            if (err) return console.log(err)
           res.contentType('image/jpeg');
           res.send(result.image.buffer)
          })
})  



module.exports = router;
  
