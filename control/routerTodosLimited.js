const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const modelTodos = require('../model/todoProcesses.js');
const todoMiddle = require('../middleware/todoMiddlewares.js');
const cookieMiddle = require('../middleware/cookieManagers.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

// API response common response configuration //
router.all('//:id/todos', apiResponseHeaders)

// SESSION COOKIE AUTHENTICATION //
// router.all('/', cookieMiddle.existVerification);
// router.all('/', cookieMiddle.contentVerification);
router.all('/:id/todos', cookieMiddle.existVerification);
router.all('/:id/todos', cookieMiddle.contentVerification);

// SESSION COOKIE RENEWING //
router.all('/:id/todos', cookieMiddle.sessionCookieRenew);

// READ all todos of user
router.get('/', (req,res)=>{
  modelTodos.loadInProfileTodos(req.params.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})


// CREATE new todo //
router.post('/:id/todos', todoMiddle.newContentVerification);
router.post('/:id/todos', (req, res)=>{
  modelTodos.createTodo(req.params.id, req.body)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})



// UPDATE todos //
//update status
router.put('/:id/todos/:index/status', todoMiddle.changeTodoStateVerification);
router.put('/:id/todos/:index/status', (req, res)=>{
  console.log(req.body.status)
  console.log(typeof(req.body.status))
  modelTodos.updateStateTodo(req.params.index, req.body.status)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})
//update notation
router.put('/:id/todos/:index/notation', (req, res)=>{
  modelTodos.updateNotationTodo(req.params.index, req.body.notation)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})



// DELETE todos //
//delete all todos
// router.delete('/', profMiddle.profileAccountExistVerification)
router.delete('/:id/todos', profMiddle.profileAccountExistVerification)
router.delete('/:id/todos', profMiddle.profileOldPwdConfirmation)
router.delete('/:id/todos', (req,res)=>{
  modelTodos.deleteAllTodos(req.params.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})
//delete single todo
// router.delete('/:index', profMiddle.profileAccountExistVerification)
router.delete('/:id/todos/:index', profMiddle.profileAccountExistVerification)
router.delete('/:id/todos/:index', profMiddle.profileOldPwdConfirmation)
router.delete('/:id/todos/:index', (req, res)=>{
  modelTodos.deleteThisTodo(req.params.id, req.params.index)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})

module.exports = router;
