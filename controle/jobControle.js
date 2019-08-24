const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/db-conf');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
const Job = require('../models/job');
const User=require('../models/user')
//Inscription
router.post('/ajouter', function(req, res, next) {
    /*jobTitle,jobDescription,jobRequirements,jobType,tags,creatorId,users:[{
       userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
      
      }], */
    var job = new Job();
    console.log(req.body);
    job.jobTitle = req.body.jobTitle;
    job.jobDescription=req.body.jobDescription;
    job.jobRequirements=req.body.jobRequirements;
    job.jobType=req.body.jobType;
    job.jobPayement=req.body.jobPayement;
    job.tags=req.body.tags;
    job.xpOnly=req.body.xpOnly;
    job.creatorId=req.body.creatorId;
    job.users=req.body.users;
    job.image=req.body.image;
    job.limitDate=req.body.limitDate;
    job.from=req.body.from;
    job.to=req.body.to;
  
    job.save(function(err,data){
        if(err)
        {
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Job créé avec succès", obj : data.id});
        }
    });
});
router.get('/', function(req, res, next) {
    Job.find().sort('-createdAt').exec(function (err, jobs) {
      if (err) {
        res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
      res.json({success:true,msg:"Success getting jobs",obj:jobs});
      }
    });
  });



//Modification
router.put('/:id',function(req,res,next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({
      message: 'Id is invalid '+req.params.id
    });
  }
  Job.findByIdAndUpdate(req.params.id,req.body, function (err, post) {
    if (err) return next(err);      
    res.json(post);
  });
});
//Postuler
router.put('/AddUserToJob/:jobId', function(req, res, next) {
    const jobId = req.params.jobId;
    const userId=req.body.userId;
    console.log(userId);
//'read_by.readerId_us': { $ne: userid }
//favJobs

    Job.update(
      { _id: jobId, 'users.userId':{$ne:userId} },
      { $addToSet: { users: { userId: userId} } }, function (err, job) {
        if (err) {
          console.log(err);
          res.json({success:false, msg : "Error"});
        }else{
        res.json({success:true,msg:"Success adding user to job",obj:job});
        }
  
      })
  
  });

  //update image
  router.put('/updateIMG/:jobId', function(req, res, next) {
    const jobId = req.params.jobId;
    console.log(req.body.image);
    const image=req.body.image;
    
//'read_by.readerId_us': { $ne: userid }
//favJobs

Job.update({"_id": jobId},{"image":image}, function (err, job) {
        if (err) {
          console.log(err);
          res.json({success:false, msg : "Error"});
        }else{
        res.json({success:true,msg:"Success updating job image",obj:job});
        }
  
      })
  
  });

  
//Recuperation by id
router.get('/getjob/:id', function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: 'Id is invalid '+req.params.id
      });
    }
    Job.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  //Suppression
  router.delete('/:id', function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
          message: 'Id is invalid '+req.params.id
        });
      }
        Job.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json("Job supprimé avec succès");
        });
    
  });

//get by users
  router.get('/getjobs/:userId', function(req, res, next) {
    console.log(req.params.userId);
    var ids = req.params.userId.toString().split(",");
    Job.find({"users.userId" : {$in : ids} }).exec(function (err, jobs) {
      if (err) return next(err);
      res.json(jobs);
    });
  });
router.get('/getcljobs/:creatorId', function(req, res, next){
 console.log(req.params.creatorId);
 Job.find({"creatorId" : req.params.creatorId}).exec(function (err, jobs){
     if(err) return next(err);
     res.json(jobs);
 });
});

router.get('/getsimilar/:id', function (req,res,next){
  Job.findById(req.params.id, function (err, post) {
    Job.find({
      tags: post.tags[0] //{ $all: post.tags }
    }).exec(function (err, jobs){
      if(err) return next(err);
      res.json(jobs);
    });
  });
})
router.get('/getusers/:id', function(req,res,next){
  let arrayOfIds=[];
  Job.findById(req.params.id, function(err, job){
   //Users.find( { "fb" : { id: { $in : arrayOfIds } } }, callback );
   for(let i=0;i<job.users.length;i++)
   {
     arrayOfIds.push(job.users[i].userId);
   }
   //Users.find( { "fb" : { id: { $in : arrayOfIds } } }, callback );
  User.find(  {"_id": {$in : arrayOfIds} }, function(err,users){
    if(err) return next(err);
    console.log(users);
    res.json(users);
  })
})
})
module.exports = router;