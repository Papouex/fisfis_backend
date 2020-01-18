const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt = require('bcrypt-nodejs');

let CommandSchema = new Schema({
  name: { type: String, required: true },
  canceled:{type:Boolean,default:false},
  delievered:{type:Boolean,default:false},
  enCours:{type:Boolean,default:true},
  promotion_code:{type:String},
  request:{type:String},
  total:{type:Number,required:true},
  chosenTime:{type:String},
  isPromotion:{type:Boolean,default:false},
  user:{
   id:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
   command_no:{type:Number},
   exact_adress:{type:String,required:true},
   client_name:{type:String},
   client_number:{type:String},
   client_zone:{type:String}
  },
  products:[{
      product:{type:mongoose.Schema.Types.ObjectId, ref:'Product',required:true},
      prod_qte:{type:Number,required:true},
      prod_name:{type:String},
      prod_unit_price:{type:String},
      prod_stock:{type:Number},
      prod_seuil:{type:Number},
      prod_image:{type:String}
  }],
  products_no: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

CommandSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit: "
});



const Command = module.exports = mongoose.model('Command', CommandSchema);

module.exports.getCommandById = function (id, callback) {
  Command.findById(id, callback);
}


