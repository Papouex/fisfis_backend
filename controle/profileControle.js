const express = require('express');
const router = express.Router();
const config = require('../config/db-conf');
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const Shift = require('../models/horraire');
const User = require('../models/user');
const passport = require('passport');
const ClientProfile = require('../models/clientProfile');
const Client = require('../models/client');
//USER SIDE
//Ajout (done front)
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profile = new Profile();
  console.log(req.body.userId);

  profile.tags = req.body.tags;
  profile.desc = req.body.desc;
  profile.location_lat = req.body.location_lat;
  profile.location_lng = req.body.location_lng;
  profile.imDisponibilite = req.body.imDisponibilite;
  profile.favJobs=req.body.favJobs;
  profile.times=req.body.times;
  profile.userId = req.body.userId;
  profile.shifts = [
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Monday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Tuesday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Wednesday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Thursday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Friday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Saturday", isActive: false },
    { shiftId: "5d276982a3d42a2ce0b7557e", day: "Sunday", isActive: false },

    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Monday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Tuesday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Wednesday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Thursday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Friday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Saturday", isActive: false },
    { shiftId: "5d27699ca3d42a2ce0b7557f", day: "Sunday", isActive: false },

    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Monday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Tuesday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Wednesday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Thursday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Friday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Saturday", isActive: false },
    { shiftId: "5d2769afa3d42a2ce0b75580", day: "Sunday", isActive: false },

    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Monday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Tuesday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Wednesday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Thursday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Friday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Saturday", isActive: false },
    { shiftId: "5d2769c3a3d42a2ce0b75581", day: "Sunday", isActive: false },

    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Monday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Tuesday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Wednesday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Thursday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Friday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Saturday", isActive: false },
    { shiftId: "5d2769d5a3d42a2ce0b75582", day: "Sunday", isActive: false },

    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Monday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Tuesday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Wednesday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Thursday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Friday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Saturday", isActive: false },
    { shiftId: "5d2769e4a3d42a2ce0b75583", day: "Sunday", isActive: false },




  ];



  profile.save(function (err, data) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {
          console.log(data);
      User.findById(req.body.userId, function (err, user) {

        user.profileId = data.id;
        user.haveProfile = true;
        User.findByIdAndUpdate(req.body.userId, user, function (err, post) {
          /* if (err) return next(err);      
           res.json(post);*/
        });
      });

      res.json({ success: true, msg: "Profile créé avec succès", obj: data.id });
    }
  });
});
//Get All
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Profile.find(function (err, profiles) {
    if (err) return next(err);
    res.json(profiles);
  });
});
//Get by userId (done front)
router.get('/:userId/detail', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  console.log(req.params.userId);
  Profile.find({ "userId": req.params.userId }).exec(function (err, profile) {
    if (err) return next(err);
    res.json(profile);
  });
});

router.put('/userspro', passport.authenticate('jwt', {session:false}), function(req,res,next){
  let users=req.body;
  let arrayOfIds=[];

   for(let i=0;i<users.length;i++)
   {
     arrayOfIds.push(users[i]._id);
   }
   Profile.find(  {"userId": {$in : arrayOfIds} }, function(err,profiles){
    if(err) return next(err);
    console.log(profiles);
    res.json(profiles);
  })
})
//Add Favorite Job
router.put('/AddJobFav/:profId', function(req, res, next) {
  const jobId = req.body.jobId;
  const profId=req.params.profId;
//'read_by.readerId_us': { $ne: userid }
//favJobs

  Profile.update(
    { _id: profId, 'favJobs.jobId':{$ne:jobId} },
    { $addToSet: { favJobs: { jobId: jobId} } }, function (err, profile) {
      if (err) {
        console.log(err);
        res.json({success:false, msg : "Error"});
      }else{
      res.json({success:true,msg:"Success adding favorite job",obj:profile});
      }

    })

});
//Modification (get profile id from user or get by user id) done front 
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  Profile.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


//Suppression (get profile id from user or get by user id) done front
router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  Profile.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json("Profile supprimé avec succès");
  });

});
//Update shifts done front 
router.put('/shifts/:profId/update', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var id = req.params.profId;

  var shift = req.body;
  console.log(shift);
  Profile.updateOne({ _id: id, shifts: { $elemMatch: { shiftId: shift.shiftId, day: shift.day } } },
    { $set: { "shifts.$.isActive": true } }, function (err, result) {
      if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: result });
      }
    });



});
//Update tags done front
router.put('/tags/:profId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagis = req.body;
  console.log(tagis);
  /**db.inventory.update(
   { _id: 2 },
   { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
 ) */
 console.log(tagis.length);

  Profile.update(
    { _id: profId },
    { $addToSet: { tags: { $each: tagis } } }, function (err, profile) {
      if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }

    })
 
});

//delete tag
router.put('/tag/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagName = req.body.tagName;
  Profile.update(
    {'_id': profId},
    {$pull: { tags: tagName  }}
  ,
    function (err, profile) {
      if (err)
      { 
        console.log(err);
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
    });

});

//Update times
router.put('/times/:profId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagis = req.body;
  console.log(tagis);
  /**db.inventory.update(
   { _id: 2 },
   { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
 ) */
 console.log(tagis.length);

  Profile.update(
    { _id: profId },
    { $addToSet: { times: { $each: tagis } } }, function (err, profile) {
      if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Job time créé avec succès", obj: profile });
      }

    })
 
});

//delete time
router.put('/time/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagName = req.body.time;
  Profile.update({'_id': profId},
    {$pull: { times: tagName  }},
    function (err, profile) {
      if (err)
      { 
        res.json({ success: false, msg: err.msg });
      }else{
      res.json({ success: true, msg: "Time supprimé avec succès", obj: profile });
      }
    });

});

//update description
router.put('/desc/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var desc = req.body.desc;

  Profile.update({ '_id': profId },{$set: {desc:desc}}, function (err, profile) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
  });
})

//update location
router.put('/loc/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var loc_lat = req.body.location_lat;
  var loc_lng = req.body.location_lng;

  Profile.update({ '_id': profId },{
    $set: {
      location_lat:loc_lat,
      location_lng:loc_lng
    }

  }, function (err, profile) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
  });
})



//CLIENT SIDE

router.post('/c/ajouter', function (req, res, next) {
  var profile = new ClientProfile();
  console.log(req.body.clientId);

  profile.tags = req.body.tags;
  profile.desc = req.body.desc;
  profile.links = req.body.links;
  profile.img_links = req.body.img_links;
  profile.location_lng = req.body.location_lng;
  profile.location_lat = req.body.location_lat;
  profile.menu_list = req.body.menu_list;
  profile.clientId = req.body.clientId;


  profile.save(function (err, data) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {

      Client.findById(req.body.clientId, function (err, client) {
        if (err) return next(err);
        client.profileId = data.id;
        client.haveProfile = true;
        Client.findByIdAndUpdate(req.body.clientId, client, function (err, post) {
          if (err) return next(err);

        });
      });

      res.json({ success: true, msg: "Profile créé avec succès", obj: data.id });
    }
  });
});

router.get('/c/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  ClientProfile.find(function (err, profiles) {
    if (err) return next(err);
    res.json(profiles);
  });
});
//Get by userId (done front)
router.get('/c/:userId/detail', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  console.log(req.params.userId);
  ClientProfile.find({ "clientId": req.params.userId }).exec(function (err, profile) {
    if (err) return next(err);
    res.json(profile);
  });
});

//Modification (get profile id from user or get by user id) done front 
router.put('/c/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  ClientProfile.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


//Suppression (get profile id from user or get by user id) done front
router.delete('/c/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid ' + req.params.id
    });
  }
  ClientProfile.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json("Profile supprimé avec succès");
  });

});

//Update tags done front
router.put('/c/tags/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagis = req.body;
  ClientProfile.update(
    { _id: profId },
    { $addToSet: { tags: { $each: tagis } } }, function (err, profile) {
      if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }

    })
});

//delete tag
router.put('/c/tag/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagName = req.body.tagName;
  ClientProfile.update({'_id': profId},
    {$pull: { tags: tagName  }},
    function (err, profile) {
      if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
    });

});
//update links
router.put('/c/links/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var tagis = req.body;
  ClientProfile.update(
    { _id: profId },
    { $addToSet: { links: { $each: tagis } } }, function (err, profile) {
      if (err)
      { 
        console.log(err);
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }

    })
});

//delete link
router.put('/c/link/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var link = req.body.link;
  console.log(link);
  /**db.survey.update(
  { },
  { $pull: { results: { score: 8 , item: "B" } } },
  { multi: true }
) */
  ClientProfile.update({'clientId': profId},
    {$pull: { links: { title: link.title, link: link.link } }},
    function (err, profile) {
      if (err)
      { console.log(err);
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
    });

});

//update description
router.put('/c/desc/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var desc = req.body.desc;

  ClientProfile.update({ '_id': profId },{$set: {desc:desc}}, function (err, profile) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
  });
})

//update location
router.put('/c/loc/:profId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var profId = req.params.profId;
  var loc_lat = req.body.location_lat;
  var loc_lng = req.body.location_lng;

  ClientProfile.update({ '_id': profId },{
    $set: {
      location_lat:loc_lat,
      location_lng:loc_lng
    }

  }, function (err, profile) {

    if (err)
      { 
        res.json({ success: false, msg: "Probleme" });
      }else{
      res.json({ success: true, msg: "Tag créé avec succès", obj: profile });
      }
  });
})


module.exports = router;