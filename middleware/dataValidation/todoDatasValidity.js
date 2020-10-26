const Joi = require('joi');
const SchemaTodo = Joi.object({
  owner: Joi.string().pattern(new RegExp('[0-9a-f]{12}')).required(),
  task: Joi.string().max(150).required(),
  priority: Joi.number().min(0).max(10),
  notation: Joi.string().max(150)
}).with('task', 'priority');

validateTodoDatas = (todoData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaTodo.validate(todoData);

    if(error){
      if(error.name === 'ValidationError'){
        let errorAnswer = {
          report: 'Validation error!',
          involvedId: error.details[0].context.key
        };
        if(errorAnswer.involvedId === 'owner')
          errorAnswer.message = 'Missing profile identifier!';
        else if(errorAnswer.involvedId === 'task')
          errorAnswer.message = 'Missing task description!';
        else if(errorAnswer.involvedId === 'priority')
          errorAnswer.message = 'Missing priority indicator!';
        else
          errorAnswer.message = 'Missing some value!';
          return reject(errorAnswer);
          
      } else {
        return reject({
          report: error.name,
          involvedId: error.details,
          message: 'Data verification error!'
        });
      }
    } else
      return resolve(value);
  });
}

testValidateTodoDatas = (todoData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaTodo.validate(todoData);
    if(error)
      return reject(error);
    else
      return resolve(value);
  });
}

module.exports.todoValidation = validateTodoDatas;
module.exports.testTodoValidation = testValidateTodoDatas;
