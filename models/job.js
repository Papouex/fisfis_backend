const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Define collection and schema for Business
let jobSchema = new Schema({
    jobTitle: { type: String, required: 'Le titre est requis' },
    jobDescription: { type: String, required: true },
    jobRequirements: { type: String, required: true },
    jobType: { type: String, required: 'Le type est requis'},
    jobPayement: { type:Number, required: 'Le payement est requis'},
    tags: {type: Array},
    xpOnly: {type:Boolean, required: 'Le champ experience est requis'},
    image:{type:String, required: 'Image de job'},
    creatorId: { type: mongoose.Schema.Types.ObjectId,ref:'Client', required: true},
    limitDate:{type:Date,required:true},
    users:[{
      _id:false,
       userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
       post_at: {type: Date, default: Date.now}
      }],
      from:{type:String,required:false},
      to:{type:String,required:false},
    created_at: {type: Date, default: Date.now}
  }, {timestamps: true});

  jobSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

const Job = module.exports = mongoose.model('Job', jobSchema);

module.exports.getJobById = function(id, callback){
  Job.findById(id,callback);
}


module.exports.getJobByUser = function(userId, callback){
  const query = {users : mongoose.Types.ObjectId(userId)} ;
  Job.findOne(query ,callback);
  
}

module.exports.getJobByCreator = function(creatorId, callback){
  const query = {creatorId : creatorId} ;
  Job.findOne(query ,callback);
  
}

