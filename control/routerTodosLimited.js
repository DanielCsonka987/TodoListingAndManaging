const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const modelTodos = require('../model/todoProcesses.js');
const todoMiddle = require('../middleware/todoMiddlewares.js');
const cookieMiddle = require('../middleware/cookieManagers.js');

// API response common response configuration //
router.all('/', apiResponseHeaders)
router.all('/:id', apiResponseHeaders)

// SESSION COOKIE AUTHENTICATION //
router.all('/:id', cookieMiddle.existVerification);
router.all('/:id', cookieMiddle.contentVerification);

// SESSION COOKIE RENEWING //
router.all('/:id', cookieMiddle.sessionCookieRenew);

// READ all todos of user
router.get('/', (req,res)=>{
  modelTodos.loadInProfileTodos(req.cookie.name)
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
router.post('/', todoMiddle.todoContentVerification);
router.post('/', (req, res)=>{
  modelTodos.createTodo(req.cookies.name, req.body)
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
router.put('/:id/status', (req, res)=>{
  modelTodos.updateStateTodo(req.body.id)
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
router.put('/:id/notation', (req, res)=>{
  modelTodos.updateNotationTodo(req.body.id)
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
router.delete('/', (req,res)=>{
  modelTodos.deleteAllTodos(req.name)
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
router.delete('/:id', (req, res)=>{
  modelTodos.deleteThisTodo(req.name, req.body.id)
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
