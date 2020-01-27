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
    if (data.admin)//Admin sender user receiver
    {
        newNotification.sender_ad = data.sender_ad;
        newNotification.receiver_user = data.receiver_user;
    }else if(data.general)
    {
      newNotification.receiver_general=data.receiver_general;
      newNotification.sender_ad=data.sender_ad;
    }else
    {
        newNotification.receivers_ad=data.receivers_ad;
        newNotification.sender_user=data.sender_user;
    }

    newNotification.title = data.title;
    newNotification.image = data.image;
    newNotification.message = data.message;
    newNotification.image=data.image;
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
            if (data.admin)//Admin is sender
            {
                req.app.io.emit(newNotification.receiver_user, 'notif for you !');
            } else
            {
                //User is sender
                for (var i in newNotification.receivers_ad) {
                    req.app.io.emit(newNotification.receivers_ad[i], 'notif for you !');
                }
                
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
    Notification.find({ 'receiver_user': userId }).sort('-createdAt').limit(15).exec(function (err, notificationFounded) {
        if (err){ 
            console.log(err);
            return res.status(status.BAD_REQUEST).json(err)
        };
        // We serve as json the Notifications founded
        res.status(status.OK).json(notificationFounded);
    });

});

//GET ADMIN NOTIFICATIONS
router.get('/ad/:adId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var adId = req.params.adId;

    // Check first if it is a valid Id
    if (!mongoose.Types.ObjectId.isValid(adId)) {
        return res.status(400).send({
            message: 'Notification Id is invalid ' + adId
        });
    }

    Notification.find({ 'receiver_ad': adId }).sort('-createdAt').limit(15).exec(function (err, notificationFounded) {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        // We serve as json the Notifications founded
        res.status(status.OK).json(notificationFounded);
    });


});
/* GET all saved Notifications admin */
router.get('/:ad', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var adId = req.params.ad;
    Notification.find({ 'receiver_ad': adId }).sort('-createdAt').exec(function (err, notifications) {
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
router.put('/seenuser/:userId', function (req, res, next) {
    const userId = mongoose.Types.ObjectId(req.params.userId);

    Notification.updateMany({ 'receiver_user': userId, 'read_by.readerId_user': { $ne: userId } }, {
        $push: {
            "read_by": {
                readerId_user: userId
            }
        }
    }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });


});

router.put('/seenad/:adId', function (req, res, next) {
    const adId = mongoose.Types.ObjectId(req.params.adId);
    Notification.updateMany({ 'receiver_ad': infId, 'read_by.readerId_ad': { $ne: adId } }, {
        $push: {
            "read_by": {
                readerId_ad: adId
            }
        }
    }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;