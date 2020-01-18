const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let PromoSchema = new Schema({

    promo:{type:String,required:true,unique:true},
    users:[{
       user: {type:mongoose.Schema.Types.ObjectId, ref:'User',required:true}
    }
    ],
    isActive:{type:Boolean,default:true},
    percentage:{type:Number,required:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

PromoSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const Promo = module.exports = mongoose.model('Promo', PromoSchema);

module.exports.getPromoById = function (id, callback) {
    Promo.findById(id, callback);
}


