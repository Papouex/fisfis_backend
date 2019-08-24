const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');


// Define collection and schema for User
let shiftSchema = new Schema({
         from: {type: Number, min: 0, max: 24, required:true},
         to: {type: Number, min: 0, max: 24, required:true}
  }, {timestamps: true});

  shiftSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
 });
 

const Shift = module.exports = mongoose.model('Shift', shiftSchema);

module.exports.getShiftById = function(id, callback){
  Shift.findById(id,callback);
}



