const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Define collection and schema for User
let profileSchema = new Schema({
    tags:    [String],
    times:[String],
    desc: {type: String,required:true},
    shifts:[{
      _id:false,
       shiftId:{type:mongoose.Schema.Types.ObjectId, ref:'Shift'},
       day:{type: String,required:true},
       isActive:{type: Boolean, required:true}
      }],
      location_lng:{type: String,required:false},
      location_lat:{type: String,required:false},

    imDisponibilite:      { type: Boolean, required: false},
    favJobs:[{
      _id:false,
       jobId:{type:mongoose.Schema.Types.ObjectId, ref:'Job'},
       post_at: {type: Date, default: Date.now}
      }],
    userId: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true, unique:true},
    createdAt: {type: Date, default: Date.now}
  }, {timestamps: true});

  profileSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
 });
 
 profileSchema.pre('save', function(next) {
  var profile = this;
  
  
  next();
});
const Profile = module.exports = mongoose.model('Profile', profileSchema);


module.exports.getProfileById = function(id, callback){
  Profile.findById(id,callback);
}

module.exports.getProfileByTag = function(tags, callback){
  const query = {tags : tags} ;
  Profile.findOne(query ,callback);
  
}
module.exports.getShiftsByProfile = function(shifts, callback){
  const query = {shifts : shifts}
}
module.exports.getProfileByImDispo = function(imDispo, callback)
{
    const query = {imDisponibilite : imDispo};
    Profile.findOne(query, callback);
}

module.exports.updateProfileShifts = function(id,shift, callback)
{
  var myquery = { "_id" : '5d2e7e943459203fb446d4f1' };
     var newvalues = { $set: {"shifts.$.isActive": true} };
     Profile.updateMany({myquery},{newvalues},callback);
}


