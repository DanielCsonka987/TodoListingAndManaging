const router = require('express').Router();

const todoMiddle = require('../middleware/todoMiddlewares.js');

const paths = require('../config/appConfig').routing


// CREATE new todo //
router.post('/:id'+paths.todoPostfix, 
  todoMiddle.todoCreationSteps)

// UPDATE todos //
//update status
router.put('/:id'+ paths.todoPostfix +'/:index'+ paths.updateStatusPostfix, 
  todoMiddle.todoStatusUpdateSteps)
//update notation
router.put('/:id'+ paths.todoPostfix +'/:index'+ paths.updateNotationPostfix, 
  todoMiddle.updateTodoNotation)


//delete single todo
router.delete('/:id'+ paths.todoPostfix +'/:index', 
  todoMiddle.singleTodoRemoval)

module.exports = router;
