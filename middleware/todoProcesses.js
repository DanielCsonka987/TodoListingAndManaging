let mongoose = require('mongoose');
let TodoSchema = require('../model/todoItem.js');

module.exports.createTodo = (profileId, todo)=>{
  return new Promise((resolve, reject)=>{
    let newtodo = new TodoSchema(todo);
    newtodo.owner = profileId;
    newtodo.save((err, doc)=>{
      if(err) reject('Creation error: ' + err);
      if(doc._id) resolve(doc);
      reject('Creation malfunction, not persisted '+ doc);
    });
  });
}

module.exports.updateStateTodo = (todoId, todoStatus)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.findById({todoId}, (err, doc)=>{
      if(err) reject('Update error: ' + err);
      doc.setStatus(todoStatus);
      resolve(doc.status);
    });
  });
}

module.exports.updateNotationTodo = (todoId, todoNotation)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.findById({todoId}, (err, doc)=>{
      if(err) reject('Update error: ' + err);
      doc.setNotation(todoNotation);
      resolve(doc.notation);
    });
  });
}

module.exports.deleteThisTodo = (profileId, todoId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteOne({_id: todoId, owner: profileId}, (err, rep)=>{
      if(err) reject('Deletion error: ' + err);
      if(rep.nDeleted === 1) resolve(rep.nDeleted);
      reject('Delete malfunction, number of deletion: ' + rep.nDeleted);
    });
  });
}

module.exports.deleteAllTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteNany({owner: profileId}, (err, rep)=>{
      if(err) reject('Deletion error: ' + err);
      resolve(rep.nDeleted);
    });
  });
}

module.exports.loadInAllTodos = ()=>{

}

module.exports.loadInProfileTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.find({owner: profileId}, (err, docs)=>{
      if(err) reject('Data reading error: ' + err);
      resolve(docs);
    });
  });
}
