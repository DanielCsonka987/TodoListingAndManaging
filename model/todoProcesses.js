const mongoose = require('mongoose');
const TodoSchema = require('./todoItem.js');

const reportProcessResult = require('./createModelAnswer.js').forInformativeObj;
const collectionTodoResult = require('./createModelAnswer.js').forTodoCollect;
const singleTodoResult = require('./createModelAnswer.js').forProfileObj;
const errorResult = require('./createModelAnswer.js').forErrorObj;

const errorMessages = require('../config/appConfig.js').front_error_messages;
const doneMessages = require('../config/appConfig.js').front_success_messages;

module.exports.loadInProfileTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.find({owner: profileId}, (err, docs)=>{
      if(err){ reject(
        errorResult( `DB error! ${err.name}` ,
          {profile: profileId}, errorMessages.model_read) );
      }
      if(docs.length == 0)  resolve( reportProcessResult( [], 'No content to show!') );
      else  resolve( collectionTodoResult(docs, doneMessages.read) );
    });
  });
}

module.exports.createTodo = (profileId, todo)=>{
  return new Promise((resolve, reject)=>{
    let newtodo = new TodoSchema(todo);
    newtodo.owner = profileId;
    newtodo.save((err)=>{
      if(err){
        reject( errorResult( `DB error! ${err.name}` ,  {profile: profileId},
          errorMessages.model_create) );
      }
      if(newtodo._id && newtodo.owner){
        resolve( singleTodoResult(newtodo, doneMessages.read) );
      }else{
        reject( errorResult('No id or owner created!', '',
          errorMessages.model_create) );
      }
    });
  });
}

module.exports.updateStateTodo = (todoId, todoStatus)=>{
  let newStatus = todoStatus? 'Finished':'Proceeding'
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, { status: newStatus,
       lastModfingDate: Date.now()}, (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {todo: todoId},
          errorMessages.model_update) );
      }
      if(!rep){
        reject( errorResult('No proper query answer is created!',
          todoId, errorMessages.model_update) );
      }
      if(rep.n === 0){
        reject( errorResult('No target to update', {todo: todoId},
          errorMessages.model_update) );
      }else if(rep.n === 1 && rep.nModified === 1){
        resolve( reportProcessResult( {todo: todoId, outcome: newStatus},
           doneMessages.update) );
      }else{
        reject( errorResult('Update is cancelled by DBMS!',
          todoId, errorMessages.model_update) );
      }
    });
  });
}

module.exports.updateNotationTodo = (todoId, todoNotation)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.updateOne({_id: todoId}, {notation: todoNotation},
       (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {todo: todoId},
          errorMessages.model_update) );
      }
      if(!rep){
        reject( errorResult('No proper query answer is created!',
          {todo: todoId}, errorMessages.model_update) );
      }
      if(rep.n === 0){
        reject( errorResult('No target to update', {todo: todoId},
         errorMessages.model_update) );
      } else if(rep.n === 1 && rep.nModified === 1 ){
        resolve( reportProcessResult( {todo: todoId, outcome: todoNotation},
           doneMessages.update) );
      } else {
        reject( errorResult('Update is cancelled by DBMS!',
          {todo: todoId}, errorMessages.model_update) );
      }
    });
  });
}

module.exports.deleteThisTodo = (profileId, todoId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteOne({_id: todoId, owner: profileId}, (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: profileId, todo: todoId},
          errorMessages.model_delete) );
      }
      if(!rep){
        reject( errorResult( 'No proper query answer is created!',
          {profile: profileId, todo: todoId}, errorMessages.model_delete) );
      }
      if(rep.n === 0){
        reject( errorResult('No target to delete!',
          {profile: profileId, todo: todoId}, errorMessages.model_delete) );
      } else if(rep.n === 1 && rep.deletedCount === 1){
        resolve( reportProcessResult( {todo: todoId}, doneMessages.delete) );
      }else{
        reject( errorResult('Update is cancelled by DBMS!',
          {profile: profileId, todo: todoId}, errorMessages.model_delete) );
      }
    });
  });
}

module.exports.deleteAllTodos = (profileId)=>{
  return new Promise((resolve, reject)=>{
    TodoSchema.deleteMany({owner: profileId}, (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: profileId},
          errorMessages.model_delete) );
      }
      if(!rep){
        reject( errorResult('No proper query answer is created!',
          {profile: profileId}, errorMessages.model_delete) );
      }
      if(rep.n === 0){
        reject( errorResult('No target to delete!',
          {profile: profileId}, errorMessages.model_delete ) );
      }else if(rep.n === rep.deletedCount){
        resolve( reportProcessResult( {profile: profileId, deletedTodo: rep.deletedCount},
          doneMessages.delete) );
      }else{
        reject( errorResult(`Deleted amount: ${rep.deletedCount} from ${rep.n}`,
          {profile: profileId}, errorMessages.model_delete) )
      }
    });
  });
}
