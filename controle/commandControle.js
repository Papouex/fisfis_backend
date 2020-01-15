const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Command = require('../models/commands');
//Ajouter commande
router.post('/ajouter', function (req, res, next) {
    var command = new Command();
    command.name = req.body.name;
    command.canceled = req.body.canceled;
    command.delievered=req.body.delievered;
    command.enCours=req.body.enCours;
    command.promotion_code=req.body.promotion_code;
    command.request=req.body.request;
    command.total=req.body.total;
    command.chosenTime=req.body.chosenTime;
    command.user=req.body.user;
    command.products=req.body.products;
    command.products_no=req.body.products_no;
       

    command.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Commande créé avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', function (req, res, next) {
    Command.find().sort('-createdAt').exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting commands", obj: commands });
        }
    });
});
//Get by id
router.get('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Command.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by user
router.get('/user/:userId', function (req, res, next) {
    var userId = req.params.userId;
    Command.find({ "user.id": userId }).exec(function (err, commands) {
        if (err) return next(err);
        res.json(commands);
    });
});
//Modification
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Command.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//Command today
router.get('/today',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Command.find({ 'createdAt': { $gte: today } }).exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today commands", obj: commands });
        }
    })
})
//Delete
router.delete('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Command.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Commande supprimée avec succès");
    });

});
//Update user command status, cancel, deliever command
router.put('/user/:commandId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const command = req.body;
    Command.update(
        { _id: commandId},
        {
            $set: {
                    canceled: command.canceled,
                    delievered: command.delievered,
                    enCours: command.enCours,
                    updatedAt: Date.now(),
            }
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //send notification
                res.json({ success: true, msg: "Success update user command", obj: command });
            }

        })
});
//Add product to command
router.put('/product/:commandId', function (req, res, next) {
    const commandId = req.params.commandId;
    const product = req.body.product;
    Command.update(
        { _id: commandId },
        {
            $addToSet: {
                products: {
                    product: product.product,
                    prod_qte: product.prod_qte,
                    prod_name: product.prod_name,
                    prod_unit_price: product.prod_unit_price,
                    prod_stock: product.prod_stock,
                    prod_seuil: product.prod_seuil,
                    prod_image: product.prod_image
                }
            }
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //Notify
                res.json({ success: true, msg: "Success adding product to command", obj: command });
            }

        })
});


module.exports = router;