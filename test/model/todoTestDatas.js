const TodoSchema = require('../../model/todoItem.js');

module.exports.todos = [
  {
    task: 'Do the loundry',
    priority: 4
  },
  {
    task: 'Make javascript project model layer',
    priority: 7,
    notation: 'The deadhline is this weekend!',
  },
  {
    task: 'Call the partner company - what are the other requirements of software',
    priority: 3,
    notation: 'IdealReality ltd. - Healthcare-revisor project',
  }
];

//at todo provesses testing
module.exports.todosSchemas = [
  new TodoSchema({
    task: 'Do the loundry',
    priority: 4
  }),
  new TodoSchema({
    task: 'Make javascript project model layer',
    priority: 7,
    notation: 'The deadhline is this weekend!',
  }),
  new TodoSchema({
    task: 'Call the partner company - what are the other requirements of software',
    priority: 3,
    notation: 'IdealReality ltd. - Healthcare-revisor project',
  })
];

module.exports.newTodos = [
  {
    task: 'Finish the testing of model layer',
    priority: 5,
    notation: 'JS Healthcare-revisor',
    status: 'Proceeding'
  },
  {
    task: 'Refactor new components',
    priority: 1
  }
]
