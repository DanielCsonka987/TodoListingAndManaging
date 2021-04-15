const router = require('express').Router();

const todoMiddle = require('../middleware/todoMiddlewares.js');

const paths = require('../config/appConfig').routing


// CREATE new todo //
router.post('/:id'+paths.todoInterText, 
  todoMiddle.todoCreationSteps)

// UPDATE todos //
//update status
router.put('/:id'+ paths.todoInterText +':index'+ paths.updateStatusPostfix, 
  todoMiddle.todoStatusUpdateSteps)
//update notation
router.put('/:id'+ paths.todoInterText +':index'+ paths.updateNotationPostfix, 
  todoMiddle.updateTodoNotation)


//delete single todo
router.delete('/:id'+ paths.todoInterText +':index', 
  todoMiddle.singleTodoRemoval)

module.exports = router;
