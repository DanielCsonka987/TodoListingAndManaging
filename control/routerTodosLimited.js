const router = require('express').Router();

const todoMiddle = require('../middleware/todoMiddlewares.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

const paths = require('../config/appConfig').routing_paths

// READ all todos of user
router.get('/:id'+paths.todoPostfix, 
  todoMiddle.readAllTodos, 
  (req,res)=>{
  res.send();
})

// CREATE new todo //
router.post('/:id'+paths.todoPostfix, 
  todoMiddle.newContentVerification, todoMiddle.createNewTodo,
  (req, res)=>{
  res.send();
})

// UPDATE todos //
//update status
router.put('/:id'+ paths.todoPostfix +'/:index'+ paths.updateStatusPostfix, 
  todoMiddle.changeTodoStateVerification, todoMiddle.updateTodoStatus,
  (req, res)=>{
  res.send();
})
//update notation
router.put('/:id'+ paths.todoPostfix +'/:index'+ paths.updateNotationPostfix, 
  todoMiddle.updateTodoNotation, 
  (req, res)=>{
  res.send();
})

// DELETE todos //
//delete all todos
router.delete('/:id'+ paths.todoPostfix, 
  profMiddle.profileOldPwdConfirmation, todoMiddle.allTodoRemoval,
  (req,res)=>{
  res.send();
})
//delete single todo
router.delete('/:id'+ paths.todoPostfix +'/:index', 
  profMiddle.profileOldPwdConfirmation, todoMiddle.singleTodoRemoval,
  (req, res)=>{
  res.send();
})

module.exports = router;
