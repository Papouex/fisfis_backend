const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let PrecommandSchema = new Schema({

    name:{type:String,required:true},
    total:{type:Number,default:0},
    imageSrc:{type:String,required:true},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    products:[{
        product:{type:mongoose.Schema.Types.ObjectId, ref:'Product'}
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

PrecommandSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



const Precommand = module.exports = mongoose.model('Precommand', PrecommandSchema);

module.exports.getPrecommandById = function (id, callback) {
    Precommand.findById(id, callback);
}


