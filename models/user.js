const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');


// Define collection and schema for User
let userSchema = new Schema({
    fname:    { type: String, required: true, unique: false},
    lname:    { type: String, required: true, unique: false},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    adress:   { type: String, required: false, unique: false},
    password: { type: String, required: 'Mot de passe requis', unique: false},
    tel:      { type: String, required: true, unique: 'Numero \"{VALUE}\", est déja utiliser' },
    image:    { type: String, unique: true, required: false},
    profileId: { type:mongoose.Schema.Types.ObjectId, ref:'Profile', required:false, unique:true},
    haveProfile: {type:Boolean, required: false},
    type:     { type:Boolean, required: true}
  }, {timestamps: true});

  userSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
 });
 userSchema.pre('save', function(next) {
  var user = this;
  user.type = false;
  user.haveProfile=false;
  
  bcrypt.hash(user.password, null , null , function(err,hash){
    if(err) return next(err);
      user.password = hash;
      next();
  });
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id,callback);
}

module.exports.getUserByEmail = function(email, callback){
  const query = {email : email} ;
  User.findOne(query ,callback);
  
}

module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass,hash, (err, isMatch) => {
    if(err) throw err; 
    callback(null, isMatch) ;
  })
}