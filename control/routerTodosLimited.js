const router = require('express').Router();

const todoMiddle = require('../middleware/todoMiddlewares.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

// READ all todos of user
router.get('/:id/todos', todoMiddle.readAllTodos)
router.get('/:id/todos', (req,res)=>{
  res.send();
})

// CREATE new todo //
router.post('/:id/todos', todoMiddle.newContentVerification);
router.post('/:id/todos', todoMiddle.createNewTodo)
router.post('/:id/todos', (req, res)=>{
  res.send();
})

// UPDATE todos //
//update status
router.put('/:id/todos/:index/status', todoMiddle.changeTodoStateVerification)
router.put('/:id/todos/:index/status', todoMiddle.updateTodoStatus)
router.put('/:id/todos/:index/status', (req, res)=>{
  res.send();
})
//update notation
router.put('/:id/todos/:index/notation', todoMiddle.updateTodoNotation)
router.put('/:id/todos/:index/notation', (req, res)=>{
  res.send();
})

// DELETE todos //
//delete all todos
router.delete('/:id/todos', profMiddle.profileOldPwdConfirmation)
router.delete('/:id/todos', todoMiddle.allTodoRemoval)
router.delete('/:id/todos', (req,res)=>{
  res.send();
})
//delete single todo
router.delete('/:id/todos/:index', profMiddle.profileOldPwdConfirmation)
router.delete('/:id/todos/:index', todoMiddle.singleTodoRemoval)
router.delete('/:id/todos/:index', (req, res)=>{
  res.send();
})

module.exports = router;
