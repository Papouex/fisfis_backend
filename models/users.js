const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');

let UserSchema = new Schema({
    fname:    { type: String, required: true},
    lname:    { type: String, required: true},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    password: { type: String, required: 'Mot de passe requis', unique: false},
    phone_number:      { type: String, required: true, unique: 'Numero \"{VALUE}\", est déja utiliser' },
    ban:{type: Boolean, default:false},
    command_no:{type:Number,default:0},
    exact_location:{type:String},
    picture_url:{type:String},
    prefered_lng:{type:String},
    zone:{type:String,required:true},
    updated_at:{type:Date,default:Date.now},
    createdAt:{type:Date,default:Date.now},
  }, {timestamps: true});

  UserSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, null , null , function(err,hash){
    if(err) return next(err);
      user.password = hash;
      next();
  });
});

const User = module.exports = mongoose.model('User', UserSchema);

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
