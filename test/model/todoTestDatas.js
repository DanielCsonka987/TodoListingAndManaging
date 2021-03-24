module.exports.profilesWithTodos = [
  {
    first_name: 'John',
    last_name: 'Doe',
    username: 'JohnD',
    password: '$2y$12$bxWoBdhpRU95E8q5Bkz1YOy57KVxFtL4KQVAA6eQ8BHfE71D0omSW', //test
    age: 31,
    occupation: 'programmer',
    todos: [
      {
        task: 'Do the loundry',
        priority: 4
      },
      {
        task: 'Upgrade thie model layer',
        priority: 7,
        notation: 'Outputs needed to be redefine'
      },
      {
        task: 'Make javascript project model layer',
        priority: 7,
        notation: 'The deadhline is this weekend!',
      }
    ]
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    username: 'janed',
    password: '$2y$12$49j8jKCSlTqN8h6mzhHgZ.62wExAInasz1TW3L0r2brEbqstkxThe', //retest
    age: 43,
    todos: [ ]
  },
  {
    first_name: 'Jack',
    last_name: 'Nicholson',
    username: 'jack',
    password: '$2y$12$koaRuHGBDzRS2SbuJjHb1eRO3GDaktQaj4yJmm.5SifMare9dw8/W', //nich
    age: 64,
    occupation: 'actor',
    todos: [
      {
        task: 'Call the partner company - what are the other requirements of software',
        priority: 3,
        notation: 'IdealReality ltd. - Healthcare-revisor project',
      },
      {
        task: 'Read the script of the new movie',
        priority: 4
      }
    ]
  },
  {
    first_name: 'Sherlock',
    last_name: 'Holmes',
    username: 'holmes',
    password: '$2y$12$GhYpTUI.GeToIdCZWjR9..1Z6/jvt4y4CFPJbP3D6gbg8wwZhKEvO',  //strong
    age: 61,
    occupation: 'detective',
    todos: [
      {
        task: 'Find the smugler at the port',
        priority: 7
      },
      {
        task: 'Argue about the new case with Mrs. Collins',
        priority: 6,
        notation: 'Robbery at Wilkins str.'
      }
    ]
  },
  {
    first_name: 'Lev',
    last_name: 'Tolstoj',
    username: 'levy',
    password: '$2y$12$JzHyZHXDIm1ygyaZkEaSkObDT1vnuAk4hj3WigjgHMNlP0cq2SwCO', //warpeace
    age: 51,
    occupation: 'writer',
    todos: [
      {
        task: 'Visit the teaparty this afternoon',
        priority: 2,
        notation: 'Chehovna str. 3.'
      },
      {
        task: 'Finish the last chapter of the book!',
        priority: 4
      }
    ]
  }

];

module.exports.bareNewTodos = [
  {
    task: 'Read the book about JavaScript!',
    priority: 5
  },
  {
    task: 'Attempt to make more complex program!',
    priority: 7,
    notation: 'Use JavaScript technology'
  },
  {
    task: 'Finish the testing of model layer',
    priority: 5,
    notation: 'JS Healthcare-revisor',
    status: 'Proceeding'
  },
  {
    task: 'Refactor new components',
    priority: 1
  },
  {
    task: 'Argue new strategy with the boss',
    priority: 9,
    notation: 'Be confident!'
  }
]

module.exports.newProfilesWithoutTodos = [
  {
    first_name: 'James',
    last_name: 'McCoy',
    username: 'mcco',
    password: '$2y$12$OzPYUkXUymu0GqlV8rExWey1JdRVqS1eyrLJaTmgkmOpYnj8SJjl.', //machine
    age: 23,
    occupation: 'engeneer',
    todos: [ ]
  },
  {
    first_name: 'Steve',
    last_name: 'Jobs',
    username: 'apple',
    password: '$2y$12$dkXxR65XhJ4/3ACPnw9POOVHFIiUc2/nnRtQ9bvT6ECe53nyUy5EO',  //donotforget
    age: 56,
    occupation: 'bussinessman',
    todos: [   ]
  }
]


