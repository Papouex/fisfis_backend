const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');

let CategorieSchema = new Schema({
  cat_name: { type: String, required: true },
  cat_img: { type: String, required: true },
  subcats_no: { type: Number },
  products_no: { type: Number },
  subcats: [{
    name: { type: String },
    products: [
      {
        product:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
      }
    ]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

CategorieSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit: "
});



const Categorie = module.exports = mongoose.model('Categorie', CategorieSchema);

module.exports.getCategorieById = function (id, callback) {
  Categorie.findById(id, callback);
}


