const mongoose = require('mongoose');
const TodoSchema = require('./todoItem.js');
const answerObject = require('./createModelAnswer.js').forModelObj;
const answerDBError = require('./createModelAnswer.js').forDBErrorObj;
const anwerOwnError = require('./createModelAnswer.js').forOwnErrorObj;


module.exports.loadInProfileTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.find({owner: profileId}, (err, docs)=>{
      if(err) reject( answerDBError(err, profileId, 'MongoDB error!') );
      if(docs.length == 0)  resolve( answerObject( [], 'No content to show!') );
      else  resolve( answerObject(docs, 'Reading done!') );
    });
  });
}

module.exports.createTodo = (profileId, todo)=>{
  return new Promise((resolve, reject)=>{
    let newtodo = new TodoSchema(todo);
    newtodo.owner = profileId;
    newtodo.save((err)=>{
      if(err) reject( answerDBError(err, 'MongoDB error!') );
      if(newtodo._id && newtodo.owner){
        resolve( answerObject(newtodo, 'Creation done!') );
      }else{
        reject( anwerOwnError('No _id or owner created!',
          newtodo, 'Creation unsuccessful!') );
      }
    });
  });
}

module.exports.updateStateTodo = (todoId, todoStatus)=>{
  let newStatus = todoStatus? 'Finished':'Proceeding'
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, { status: newStatus,
       lastModfingDate: Date.now()}, (err, rep)=>{
      if(err) reject( answerDBError(err, todoId, 'MongoDB error!') );
      if(!rep){
        reject( anwerOwnError('No proper query answer is created!',
          todoId, 'Updating unsuccessful!') );
      }
      if(rep.n === 0){
        reject( anwerOwnError('No target to update',
          todoId, 'Updating unsuccessful!') );
      }else if(rep.n === 1 && rep.nModified === 1){
        resolve( answerObject(todoId, 'Updating done!') );
      }else{
        reject( anwerOwnError('Update is cancelled by DBMS!',
          todoId, 'Updating unsuccessful!') );
      }
    });
  });
}

module.exports.updateNotationTodo = (todoId, todoNotation)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, {notation: todoNotation},
       (err, rep)=>{

      if(err) reject( answerDBError(err, todoId, 'MongoDB error!') );
      if(!rep){
        reject( anwerOwnError('No proper query answer is created!',
          todoId, 'Updating unsuccessful!') );
      }
      if(rep.n === 0){
        reject( anwerOwnError('No target to update',
          todoId, 'Updating unsuccessful!') );
      }else if(rep.n === 1 && rep.nModified === 1 ){
        resolve( answerObject(todoId, 'Updating done!') );
      }else{
        reject( anwerOwnError('Update is cancelled by DBMS!',
          todoId, 'Updating unsuccessful!') );
      }
    });
  });
}

module.exports.deleteThisTodo = (profileId, todoId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteOne({_id: todoId, owner: profileId}, (err, rep)=>{

      if(err) reject( answerDBError(err, {todo: todoId}, 'MongoDB error!') );
      if(!rep){
        reject( anwerOwnError( 'No proper query answer is created!',
          {profile: profileId, todo: todoId}, 'Deletion unsucessful!') );
      }
      if(rep.n === 0){
        reject( anwerOwnError('No target to delete!',
          {profile: profileId, todo: todoId}, 'Deletion unsucessful!') );
      } else if(rep.n === 1 && rep.deletedCount === 1){
        resolve( answerObject(todoId,'Deletion done!') );
      }else{
        reject( anwerOwnError('Update is cancelled by DBMS!',
          {profile: profileId, todo: todoId}, 'Deletion unsucessful!') );
      }
    });
  });
}

module.exports.deleteAllTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteMany({owner: profileId}, (err, rep)=>{

      if(err) reject( answerDBError(err, {profile: profileId}, 'MongoDB error!') );
      if(!rep){
        reject( anwerOwnError('No proper query answer is created!',
          profileId, 'Deletion unsuccessful!') );
      }
      if(rep.n === 0){
        reject( anwerOwnError('No target to delete!',
          profileId,'Deletion unsuccessful!') );
      }else if(rep.n === rep.deletedCount){
        resolve( answerObject( {profile: profileId, deleted: rep.deletedCount},
          'Deletion done!') );
      }else{
        reject( anwerOwnError(`Deleted amount: ${rep.deletedCount} from ${rep.n}`,
          profileId, 'Deletion unsuccessful') )
      }
    });
  });
}
