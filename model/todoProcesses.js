let mongoose = require('mongoose');
let TodoSchema = require('./todoItem.js');

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
      if(!rep)
        reject( {_id: todoId, report: rep, message: 'Update malfuntion!'} );
      if(rep.n === 0)
        reject( {_id: todoId, report: rep, message: 'No target to update!'});
      if(rep.n === 1 && rep.nModified === 1){
        resolve( {_id: todoId, report: rep, message: 'Update done!' });
      }else{
        reject( {_id: todoId, report: rep, message: 'Update malfunction!' });
      }
    });
  });
}

module.exports.updateNotationTodo = (todoId, todoNotation)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, {notation: todoNotation},
       (err, rep)=>{

      if(err) reject( {_id: todoId, report: err, message: 'MongoDB error!'} );
      if(!rep)
        reject( {_id: todoId, report: rep, message: 'Update malfuntion!'} );
      if(rep.n === 0)
        reject( {_id: todoId, report: rep, message: 'No target to update!'});
      if(rep.n === 1 && rep.nModified === 1 ){
        resolve( {_id: todoId, report: rep, message: 'Update done!'} );
      }else{
        reject( {_id: todoId, report: rep, message: 'Update malfunction!'} );
      }
    });
  });
}

module.exports.deleteThisTodo = (profileId, todoId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteOne({_id: todoId, owner: profileId}, (err, rep)=>{

      if(err) reject( {report: err, error: 'MongoDB error!'} );
      if(!rep)
        reject( {report: rep, message: 'Delete malfuntion!'} );
      if(rep.n === 0)
        reject( {report: rep, message: 'No target to delete!'} );
      if(rep.n === 1 && rep.deletedCount === 1){
        resolve( {report: rep, message: 'Deletion done!'} );
      }else{
        reject( {report: rep, message: 'Delete malfunction!'} );
      }
    });
  });
}

module.exports.deleteAllTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteMany({owner: profileId}, (err, rep)=>{

      if(err) reject( {report: err, message: 'MongoDB error!'} );
      if(!rep)
        reject( {report: rep, message: 'Delete malfuntion!'} );
      if(rep.n === 0)
        reject( {report: rep, message: 'No target to delete!'} );
      if(rep.n === rep.deletedCount){
        resolve( {report: rep.deletedCount, message: 'Deletion successfully!'} );
      }else{
        reject( {report: rep, message: 'Deleted amount: ' + rep.deletedCount
         + ' from ' + rep.n} )
      }
    });
  });
}

module.exports.loadInProfileTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.find({owner: profileId}, (err, docs)=>{

      if(err) reject( {report: err, message: 'MongoDB error!'} );
      if(!docs)
        reject( {report: [], message: 'No content to show!'} );
      else
        resolve( {report: docs, message: 'Reading done!'} );
    });
  });
}
