const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoItemSchema = Schema({

  task: {type: String, require: true, maxlength: 150},
  priority: {type: Number, require: true, min: 0, max: 10 },
  notation: {type: String, maxlength: 150},
  startingDate: {type: Date, default: Date.now()},
  lastModfingDate: {type: Date, default: Date.now()},
  status: {type: String, enum: ['Finished', 'Proceeding'], default: 'Proceeding' },
  owner: {type: Schema.Types.ObjectId, require: true, ref: 'profiles'}
});

TodoItemSchema.method.changeTodoStatus = function(id, todoid, state){

}

TodoItemSchema.static.changeTodoNote = function(id, todoid, note){

}

module.exports = TodoItemSchema;
