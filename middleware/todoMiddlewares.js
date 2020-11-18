const verifyTodo = require('../utils/dataValidation/todoDatasValidity.js');
const verifyState = require('../utils/dataValidation/todoStateDataValidity.js');
const modelTodos = require('../model/todoProcesses.js')

module.exports.newContentVerification = (req, res, next)=>{
  verifyTodo(req.params.id, req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}

module.exports.changeTodoStateVerification = (req, res, next)=>{
  verifyState(req.body.status)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}


// TERMINAL PROCESSES //

module.exports.readAllTodos = (req, res, next)=>{
  modelTodos.loadInProfileTodos(req.params.id)
  .then(result=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify(err));
  });
}

module.exports.createNewTodo = (req, res, next)=>{
  modelTodos.createTodo(req.params.id, req.body)
  .then(result=>{
    res.status(201);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify(err));
  });
}

module.exports.updateTodoStatus = (req, res, next)=>{
  modelTodos.updateStateTodo(req.params.index, req.body.status)
  .then(result=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify(err));
  });
}

module.exports.updateTodoNotation = (req, res, next) =>{
  modelTodos.updateNotationTodo(req.params.index, req.body.notation)
  .then(result=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify(err));
  });
}

module.exports.allTodoRemoval = (req, res, next)=>{
  modelTodos.deleteAllTodos(req.params.id)
  .then(result =>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500); //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  })
}

module.exports.singleTodoRemoval = (req, res, next)=>{
  modelTodos.deleteThisTodo(req.params.id, req.params.index)
  .then(result=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify(err));
  });
}
