const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TodoItemSchema = Schema({

  task: {type: String, require: true, maxlength: 150},
  priority: {type: Number, require: true, min: 0, max: 10 },
  notation: {type: String, maxlength: 150},
  startingDate: {type: Date, default: Date.now()},
  lastModfingDate: {type: Date, default: Date.now()},
  status: {type: String, enum: ['Finished', 'Proceeding'], default: 'Proceeding' },
  owner: {type: Schema.Types.ObjectId, require: true, ref: 'profiles'}
});

TodoItemSchema.virtual('setStatus').set((status)=>{
  this.status = status;
  this.lastModfingDate = Date.now();
});

TodoItemSchema.virtual('setNotation').set((notation)=>{
  this.notation = notation;
  this.lastModfingDate = Date.now();
});

module.exports = mongoose.model('todos', TodoItemSchema);
