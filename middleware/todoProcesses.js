let mongoose = require('mongoose');
let TodoSchema = require('../model/todoItem.js');

module.exports.createTodo = (profileId, todo)=>{
  return new Promise((resolve, reject)=>{
    let newtodo = new TodoSchema(todo);
    newtodo.owner = profileId;
    newtodo.save((err)=>{

      if(err) reject( { report: err, message: 'MongoDB error!'} );
      if(newtodo._id && newtodo.owner){
        resolve( { report: newtodo, message: 'Creation done!' } );
      }else{
        reject( {report: newtodo, message: 'Creation malfunction!'} );
      }
    });
  });
}

module.exports.updateStateTodo = (todoId, todoStatus)=>{
  let newStatus = todoStatus? 'Finished':'Proceeding'
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, { status: newStatus,
       lastModfingDate: Date.now()}, (err, rep)=>{

      if(err) reject( {_id: todoId, report: err, message: 'MongoDB error!'} );
      if(rep.n === 1 && rep.nModified === 1){
        resolve( {_id: todoId, report: rep, message: 'Update done!' });
      }else{
        reject( {_id: todoId, report: rep, message: 'Update malfunction!', });
      }
    });
  });
}

module.exports.updateNotationTodo = (todoId, todoNotation)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, {notation: todoNotation},
       (err, rep)=>{

      if(err) reject( {_id: todoId, report: err, message: 'MongoDB error!'} );
      if(rep.n == 1 && rep.nModified ==1 ){
        resolve( {_id: todoId, report: rep, message: 'Update done!'} );
      }else{
        reject( {_id: todoId, report: rep, message: 'Update malfuncion!'} );
      }
    });
  });
}

module.exports.deleteThisTodo = (profileId, todoId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteOne({_id: todoId, owner: profileId}, (err, rep)=>{

      if(err) reject( {report: err, error: 'MongoDB error!'} );
      if(rep.n == 1 && rep.nDeleted == 1){
        resolve( {report: rep, message: 'Deletion successfully!'} );
      }else{
        reject( {report: rep, message: 'Delete malfunction!'} );
      }
    });
  });
}

module.exports.deleteAllTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteNany({owner: profileId}, (err, rep)=>{

      if(err) reject( {report: err, message: 'MongoDB error!'} );
      if(rep.n == rep.nDeleted){
        resolve( {report: rep.nDeleted, message: 'Deletion successfully!'} );
      }else{
        reject( {report: rep, message: 'Deleted amount: ' + rep.nDeleted
         + ' from ' + rep.n} )
      }
    });
  });
}

module.exports.loadInProfileTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.find({owner: profileId}, (err, docs)=>{

      if(err) reject( {report: err, message: 'MongoDB error!'} );
      resolve( {report: docs, message: 'Reading done!'} );
    });
  });
}
