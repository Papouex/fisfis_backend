const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let AdsSchema = new Schema({

    title:{type:String,required:true},
    second_title:{type:String,required:true},
    third_title:{type:String,required:true},
    imageSrc:{type:String,required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

AdsSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const Ads = module.exports = mongoose.model('Ads', AdsSchema);

module.exports.getAdsById = function (id, callback) {
    Ads.findById(id, callback);
}


