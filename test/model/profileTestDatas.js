const ProfileSchema = require('../../model/profileItem.js');

module.exports.profiles = [
  {
    first_name: 'John',
    last_name: 'Doe',
    username: 'JohnD',
    password: '$2y$12$bxWoBdhpRU95E8q5Bkz1YOy57KVxFtL4KQVAA6eQ8BHfE71D0omSW', //test
    age: 31,
    occupation: 'actor'
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    username: 'janed',
    password: '$2y$12$49j8jKCSlTqN8h6mzhHgZ.62wExAInasz1TW3L0r2brEbqstkxThe', //retest
    age: 43
  },
  {
    first_name: 'Jack',
    last_name: 'Nicholson',
    username: 'jack',
    password: '$2y$12$koaRuHGBDzRS2SbuJjHb1eRO3GDaktQaj4yJmm.5SifMare9dw8/W', //nich
    age: 64,
    occupation: 'actor'
  },
  {
    first_name: 'Sherlock',
    last_name: 'Holmes',
    username: 'holmes',
    password: '$2y$12$GhYpTUI.GeToIdCZWjR9..1Z6/jvt4y4CFPJbP3D6gbg8wwZhKEvO',  //strong
    age: 61,
    occupation: 'detective'
  },
  {
    first_name: 'Lev',
    last_name: 'Tolstoj',
    username: 'levy',
    password: '$2y$12$JzHyZHXDIm1ygyaZkEaSkObDT1vnuAk4hj3WigjgHMNlP0cq2SwCO', //warpeace
    age: 51,
    occupation: 'writer'
  }
];

module.exports.newProfile = {
  first_name: 'James',
  last_name: 'McCoy',
  username: 'mcco',
  password: '$2y$12$OzPYUkXUymu0GqlV8rExWey1JdRVqS1eyrLJaTmgkmOpYnj8SJjl.', //machine
  age: 23,
  occupation: 'engeneer'
};

//at todo processes testing
module.exports.newProfSchema = new ProfileSchema({
  first_name: 'Steve',
  last_name: 'Jobs',
  username: 'apple',
  password: 'donotforget',
  age: 56,
  occupation: 'bussinessman'
});
