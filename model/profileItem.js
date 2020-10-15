const mongoose = require('mongoose');

var ProfileItemSchema = mongoose.Schema({
  first_name: {type: String, require: true, maxlength: 80},
  last_name: {type: String, maxlength: 80},
  username: {type: String, require: true, maxlength: 70},
  password: {type: String, require: true, maxlength: 60},
  age: {type: Number, min:5, max: 120, default: 18 },
  occupation: {type: String, maxlength: 50, default:'unknown'}
});

ProfileItemSchema.virtual('fullName').get(()=>{
  return `${this.first_name} ${this.last_name}`;
});

ProfileItemSchema.virtual('resourceURL').get((routPath)=>{
  return `${routPath}/${this._id}`;
});

module.exports = mongoose.model('profiles', ProfileItemSchema);
