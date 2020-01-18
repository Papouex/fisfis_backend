const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Categorie = require('../models/categorie');
const multer = require('multer');
//Ajouter categorie
router.post('/ajouter', function (req, res, next) {
    var categorie = new Categorie();
    categorie.cat_name=req.body.cat_name;
    categorie.cat_img=req.body.cat_img;
    categorie.subcats_no=req.body.subcats_no;
    categorie.products_no=req.body.products_no;
    categorie.subcats=req.body.subcats;
     categorie.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Categorie créée avec succès", obj: data.id });
        }
    });
});
//Add product to categorie
router.put('/product/:categorieId', function (req, res, next) {
    const categorieId = req.params.categorieId;
    const product = req.body.product;
    const subcat=req.body.subcat
    Categorie.update(
        { _id: categorieId, 'subcats._id': subcat  },
        {
            $push: {
                'subcats.$.products': {
                    product:product
                }
            }
        }, function (err, categorie) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //Notify
                res.json({ success: true, msg: "Success adding product to categorie", obj: categorie });
            }

        })
});
//Read all
router.get('/', function (req, res, next) {
    Categorie.find().sort('-createdAt').exec(function (err, categories) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting categories", obj: categories });
        }
    });
});
//Categories Number
router.get('/nbr',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Categorie.find().count(function (err, count) {
        if (err) return next(err);
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
    Categorie.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Categorie.findById(req.params.id, function (err, post) {
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
    Categorie.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Categorie supprimée avec succès");
    });

});
//MULTER FOR FILE UPLOAD CONGIF
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/categories/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
    }
});
var upload = multer({ storage: storage })
//Update categorie image
router.post('/image/:id', upload.single('image'), function (req, res) {
    var imgSRC = "/uploads/categories/" + req.file.filename;
    Categorie.update({ "_id": req.params.id }, { $set: { 'cat_img': imgSRC } }, function (err, categorie) {
        if (err) {
            return res.json({ success: false, msg: "Probleme update" })
        } else {
            return res.json({ success: true, obj:categorie });
        }

    });
});


module.exports = router;