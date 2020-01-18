const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let GeneralSchema = new Schema({

    opening_hour:{type:String,required:true},
    closing_hour:{type:String,required:true},
    locations_list:[String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

GeneralSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const General = module.exports = mongoose.model('General', GeneralSchema);

module.exports.getGeneralById = function (id, callback) {
    General.findById(id, callback);
}


