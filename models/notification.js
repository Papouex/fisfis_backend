var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var NotificationSchema   = new Schema({
    sender_cl:{type:mongoose.Schema.Types.ObjectId, ref:'Client', required:false,unique:false},
    receiver_cl:{type:mongoose.Schema.Types.ObjectId, ref:'Client', required:false,unique:false},
    sender_us:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:false,unique:false},
    receiver_us:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:false,unique:false},
    receiver_general:[{type:mongoose.Schema.Types.ObjectId, ref:'User', required:false,unique:false}], // Ids of the receivers of the notification
    title: String,
    message: String, // any description of the notification message 
    link: { url:{type:String},params:{type:String},paramsValue:{type:String}},
    image:    { type: String, unique: false,required:false},
    read_by:[{
      _id: false,
     readerId_us:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:false,unique:false},
     readerId_cl:{type:mongoose.Schema.Types.ObjectId, ref:'Client',required:false,unique:false},
     read_at: {type: Date, default: Date.now}
    }],
    created_at:{type: Date, default: Date.now},
    
  }, {timestamps: true});

  NotificationSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});


// on every save, add the date and edit updated date
NotificationSchema.pre('save', function(next) {
  // The current date
  var currentDate = new Date();
  
  // edit the updated_at field to the current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// Create a model from the schema
const Notification = mongoose.model('Notification', NotificationSchema);

// Exports it to be abailable in all the application
module.exports = Notification;