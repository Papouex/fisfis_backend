const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
//Add Product
router.post('/ajouter', function (req, res, next) {
  
    var product = new Product();
    product.product_identifier=req.body.product_identifier;
    product.name=req.body.name;
    product.prix_u=req.body.prix_u;
    product.qteStock=req.body.qteStock;
    product.purchasedQte=req.body.purchasedQte;
    product.imageSrc=req.body.imageSrc;
    product.isActive=req.body.isActive;
    product.seuilStock=req.body.seuilStock;
    

    product.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Produit créé avec succès", obj: data.id });
        }
    });
});
//Get all products
router.get('/', function (req, res, next) {
    Product.find().sort('-createdAt').exec(function (err, products) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting products", obj: products });
        }
    });
});
//Get products nbr
router.get('/nbr',function (req, res, next){
    Product.find().count(function(err, count){
      if(err) return next(err);
      res.json(count);
  });
})
//Update product
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//Get product by id
router.get('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Product.findById(req.params.id, function (err, post) {
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
    Product.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Trip supprimé avec succès");
    });

});

//update active product status
router.put('/active/:productId', function (req, res, next) {
    const productId = req.params.productId;
    const isActive = req.body.isActive;
    Product.update({ "_id": productId }, { "isActive": isActive }, function (err, product) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success updating active product status", obj: product });
        }
    })
});
//Update product quantité
router.put('/qte/:productId', function (req, res, next) {
    const productId = req.params.productId;
    const qteStock = req.body.qteStock;
    const purchasedQte=req.body.purchasedQte;
    Product.update({ "_id": productId }, { $set:{
        "qteStock": qteStock,
        "purchasedQte":purchasedQte
    }
    }, function (err, product) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success updating product qte number", obj: product });
        }
    })
});
//MULTER FOR IMAGE UPLOAD CONGIF
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
    }
});
var upload = multer({ storage: storage })

//Upload product image
router.post('/imageup', upload.single('image'), function (req, res) {
    var imgSRC = "/uploads/products/" + req.file.filename;
    return res.json({success: true,image:imgSRC})
});
//Update product image
router.post('/image/:id', upload.single('image'), function (req, res) {
    var imgSRC = "/uploads/products/" + req.file.filename;
    Product.update({ "_id": req.params.id }, { $set: { 'imageSrc': imgSRC } }, function (err, product) {
        if (err) {
            return res.json({ success: false, msg: "Probleme update" })
        } else {
            return res.json({ success: true, obj:product});
        }

    });
});

module.exports = router;