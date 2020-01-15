const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let PassSchema = new Schema({

    pass:{type:String,required:true,unique:true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    isActive:{type:Boolean,default:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

PassSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const Pass = module.exports = mongoose.model('Pass', PassSchema);

module.exports.getPassById = function (id, callback) {
    Pass.findById(id, callback);
}


