const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let ProductSchema = new Schema({

    product_identifier: { type: String,required:true },
    imageSrc: { type: String,required:true },
    isActive: { type: Boolean, default: true },
    name: { type: String,required:true },
    prix_u: { type: Number,required:true },
    qteStock: { type: Number,required:true },
    seuilStock:{type:Number,default:10},
    purchasedQte:{type:Number,default:0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ProductSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function (id, callback) {
    Product.findById(id, callback);
}


