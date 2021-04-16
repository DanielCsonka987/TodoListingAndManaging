const verifyTodo = require('../utils/validation/todoDatasValidity.js');
const verifyState = require('../utils/validation/todoStateDataValidity.js');
const model = require('../model/ProfileModel.js')
const todoView = require('../view/middleView').forTodos

module.exports.todoCreationSteps = [
  newContentVerification, createNewTodo
]

function newContentVerification(req, res, next){
  verifyTodo(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(200);
    res.json(todoView.todoVerifyFailed(err));
  });
}
function createNewTodo(req, res){
  const todoCotent = {
    task: req.body.task,
    priority: req.body.priority,
    notation: req.body.notation
  }
  model.addNewTodo(req.params.id, todoCotent, result=>{
    if(result.status === 'success'){
      res.status(201);
      res.json( todoView.todoCreationSuccess(result) )
    }else{
      res.status(500);
      res.json( todoView.todoCreationFailed(result) )
    }
  })
}


module.exports.todoStatusUpdateSteps = [
  changeTodoStateVerification, updateTodoStatus
]
function changeTodoStateVerification(req, res, next){
  verifyState(req.body.status)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(200);
    res.json( todoView.todoStatusChangeVerifyFailed );
  });
}
function updateTodoStatus(req, res){
  const newStatusText = req.body.status === 'true'? 'Finished' : 'Proceeding'
  model.modifyTodoStatus(req.params.id, req.params.index, newStatusText, result=>{
    if(result.status === 'success'){
      res.status(200);
      res.json( todoView.todoUpdateSuccess(result) );
    }else{
      res.status(500);
      res.json( todoView.todoUpdateFailed(result) );
    }
  })
}


module.exports.updateTodoNotation = [
  changeTodoNoteVerification, updateNotation
]
function changeTodoNoteVerification(req, res, next){
  if(typeof req.body.notation === 'string'){
    next()
  }else{
    res.status(200)
    res.json( todoView.todoNotationChangeVerifyFailed )
  }
}
function updateNotation(req, res){
  model.modifyTodoNotation(req.params.id, req.params.index, req.body.notation, result=>{
    if(result.status === 'success'){
      res.status(200);
      res.json( todoView.todoUpdateSuccess(result) );
    }else{
      res.status(500);
      res.json( todoView.todoUpdateFailed(result) );
    }
  })
}


module.exports.singleTodoRemoval = (req, res)=>{
  model.removeThisTodo(req.params.id, req.params.index, result=>{
    if(result.status === 'success'){
      res.status(200);
      res.json( todoView.todoRemoveSuccess(result) );
    }else{
      res.status(500);
      res.json( todoView.todoRemoveFailed(result) );
    }
  })
}
