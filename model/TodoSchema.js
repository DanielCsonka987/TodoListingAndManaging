const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoItemSchema = Schema({

  task: {type: String, required: true, maxlength: 150 },
  priority: {type: Number, required: true, min: 0, max: 10 },
  notation: {type: String, maxlength: 150},
  startingDate: {type: Date, default: Date.now()},
  lastModfingDate: {type: Date, default: Date.now()},
  status: {type: String, enum: ['Finished', 'Proceeding'], default: 'Proceeding' }
});

TodoItemSchema.methods.changeTodoStatus = function(newStatus, newDate){
  this.status = newStatus
  this.lastModfingDate = newDate;
}
TodoItemSchema.methods.changeTodoNote = function(newNote, newDate){
  this.notation = newNote
  this.lastModfingDate = newDate;
}

module.exports = TodoItemSchema;
