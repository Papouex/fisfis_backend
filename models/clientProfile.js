const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Define collection and schema for User
let ClientProfileSchema = new Schema({
    tags:    [String],
    desc: {type: String,required:true},
    links:[{
      _id:false,
       title:{type: String,required:false},
       link:{type: String, required:false}
      }],
      img_links: [String],
      location_lng:{type: String,required:false},
      location_lat:{type: String,required:false},
      menu_list:[String],
      couverture:{type: String,required:false,unique:false},
    clientId: {type:mongoose.Schema.Types.ObjectId, ref:'Client', required:true, unique:true},
    createdAt: {type: Date, default: Date.now}
  }, {timestamps: true});

  ClientProfileSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
 });
 
 
const ClientProfile = module.exports = mongoose.model('ClientProfile', ClientProfileSchema);


module.exports.getProfileById = function(id, callback){
  ClientProfile.findById(id,callback);
}

module.exports.getProfileByTag = function(tags, callback){
  const query = {tags : tags} ;
  ClientProfile.findOne(query ,callback);
  
}



