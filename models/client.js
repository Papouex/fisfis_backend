const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');

// Define collection and schema for Business
let ClientSchema = new Schema({
    pm:       { type: Boolean},
    name:     { type: String, required: function() { return this.pm; }},
    mat_fis:  { type: String, required: function() { return this.pm; }},
    fname:    { type: String, required: true},
    lname:    { type: String, required: true},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    adress:   { type: String, required: true, unique: false},
    password: { type: String, required: 'Mot de passe requis', unique: false},
    tel:      { type: String, required: true, unique: 'Numero \"{VALUE}\", est déja utiliser' },
    fax:      { type: String, required: false, trim: true, index: true, unique: 'Fax \"{VALUE}\", est déja utiliser', sparse: true},
    image:    { type: String, unique: true},
    profileId: { type:mongoose.Schema.Types.ObjectId, ref:'Profile', required:false, unique:true},
    haveProfile: {type:Boolean, required: false},
    type:     { type: Boolean, required: true}
  }, {timestamps: true});

  ClientSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

ClientSchema.pre('save', function(next) {
  var client = this;
  client.type=true;
  bcrypt.hash(client.password, null , null , function(err,hash){
    if(err) return next(err);
      client.password = hash;
      next();
  });
});

const Client = module.exports = mongoose.model('Client', ClientSchema);

module.exports.getClientById = function(id, callback){
  Client.findById(id,callback);
}

module.exports.getClientByEmail = function(email, callback){
  const query = {email : email} ;
  Client.findOne(query ,callback);
  
}

module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass,hash, (err, isMatch) => {
    if(err) throw err; 
    callback(null, isMatch) ;
  })
}