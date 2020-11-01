const router = require('express').Router();

const modelTodos = require('../model/todoProcesses.js');
const verifyTodo = require('../middleware/dataValidation/todoDatasValidity.js');

// READ all todos of user
router.get('/', (req,res)=>{
  modelTodos.loadInProfileTodos(req.cookie.name)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})


// CREATE new todo //
//todo content revision
router.post('/', (req, res, next)=>{
  verifyTodo(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    err.defStatus = 400;
    next(err);
  });
})
//new todo saving
router.post('/', (req, res)=>{
  modelTodos.createTodo(req.cookies.name, req.body)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})



// UPDATE todos //
//update status
router.put('/:id/status', (req, res)=>{
  modelTodos.updateStateTodo(req.body.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{  throw new Error(err);  });
})
//update notation
router.put('/:id/notation', (req, res)=>{
  modelTodos.updateNotationTodo(req.body.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})



// DELETE todos //
//delete all todos
router.delete('/', (req,res)=>{
  modelTodos.deleteAllTodos(req.name)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})
//delete single todo
router.delete('/:id', (req, res)=>{
  modelTodos.deleteThisTodo(req.name, req.body.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})

module.exports = router;
