const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Define collection and schema for Business
var imageSchema = new Schema({}, { strict: false });
   

  imageSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

var Image = module.exports = mongoose.model('Image', imageSchema);