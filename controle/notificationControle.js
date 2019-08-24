const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const passport = require('passport');

/* POST: save a new Notification */
router.post('/create', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var data = req.body;
    console.log(data);
    // create a new Notification
    var newNotification = new Notification();
    if (data.type)//Client is sender
    {
        newNotification.sender_cl = data.sender_cl;
        newNotification.receiver_us = data.receiver_us;
    } else {//User is sender
        newNotification.sender_us = data.sender_us;
        newNotification.receiver_cl = data.receiver_cl;
    }

    if (data.general)//Admin send general notification
    {
        newNotification.receiver_general = data.receiver_general;
    }

    newNotification.title = data.title;
    newNotification.image = data.image;
    newNotification.message = data.message;
    newNotification.image=data.image;
    //details?id=5d4f595574481346102f7d32

    newNotification.link = data.link;
    // save the Notification
    newNotification.save(function (err, notification) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(notification)
            res.json({ success: true, msg: "notification créé avec succès",obj:notification });
            // sent notif to all users
            if (data.general) {
                for (var i in newNotification.receiver_general) {
                    req.app.io.emit(newNotification.receiver_general[i], 'notif for you !');
                }
            }
            if (data.type)//Client is sender
            {
                req.app.io.emit(newNotification.receiver_us, 'notif for you !');
            } else {
                //User is sender
                req.app.io.emit(newNotification.receiver_cl, 'notif for you !');
            }

        }
    });
});


/* GET a Notification by receiver ID. */
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.userId;

    // Check first if it is a valid Id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            message: 'Notification Id is invalid ' + userId
        });
    }
    //needed for user notification
    Notification.find({ 'receiver_us': userId }).sort('-createdAt').limit(15).exec(function (err, notificationFounded) {
        if (err){ 
            console.log(err);
            return res.status(status.BAD_REQUEST).json(err)
        };
        // We serve as json the Notifications founded
        res.status(status.OK).json(notificationFounded);
    });

});

router.get('/client/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.userId;

    // Check first if it is a valid Id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            message: 'Notification Id is invalid ' + userId
        });
    }

    Notification.find({ 'receiver_cl': userId }).sort('-createdAt').limit(15).exec(function (err, notificationFounded) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        // We serve as json the Notifications founded
        res.status(status.OK).json(notificationFounded);
    });


});



/* GET all saved Notifications */
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Notification.find({}, function (err, notifications) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // object of all the Notifications
        res.status(status.OK).json(notifications);
    });
});

/* DELETE: delete a Notification by id */
router.delete('/Notification/:notificationId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var notificationId = req.params.notificationId;

    // find the notification by id and remove it
    Notification.findByIdAndRemove(notificationId, function (err) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // The notification has been deleted
        res.status(status.OK).json({ message: 'SUCCESS' });
    });
});


router.put('/seenu/:userid', function (req, res, next) {
    const userid = mongoose.Types.ObjectId(req.params.userid);

    Notification.updateMany({ 'receiver_us': userid, 'read_by.readerId_us': { $ne: userid } }, {
        $push: {
            "read_by": {
                readerId_us: userid
            }
        }
    }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });


});
router.put('/seenc/:userid', function (req, res, next) {
    const userid = mongoose.Types.ObjectId(req.params.userid);
    Notification.updateMany({ 'receiver_cl': userid, 'read_by.readerId_cl': { $ne: userid } }, {
        $push: {
            "read_by": {
                readerId_cl: userid
            }
        }
    }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;