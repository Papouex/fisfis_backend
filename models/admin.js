const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');

let AdminSchema = new Schema({
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    password: { type: String, required: 'Mot de passe requis', unique: false},
    name:{type:String, required:true},
    delivery:{type:Boolean,required:true,default:false}
  }, {timestamps: true});

  AdminSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

AdminSchema.pre('save', function(next) {
  var admin = this;
  bcrypt.hash(admin.password, null , null , function(err,hash){
    if(err) return next(err);
      admin.password = hash;
      next();
  });
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.getAdminById = function(id, callback){
  Admin.findById(id,callback);
}

module.exports.getAdminByEmail = function(email, callback){
  const query = {email : email} ;
  Admin.findOne(query ,callback);
  
}

module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass,hash, (err, isMatch) => {
    if(err) throw err; 
    callback(null, isMatch) ;
  })
}
