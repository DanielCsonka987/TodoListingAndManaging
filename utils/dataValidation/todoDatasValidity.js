const Joi = require('joi');
const mongodbid = require('../../config/appConfig').mongodbid_regexp;
const SchemaTodo = Joi.object({
  owner: Joi.string().pattern(new RegExp(mongodbid)).max(24).required(),
  task: Joi.string().max(150).required(),
  priority: Joi.number().min(0).max(10),
  notation: Joi.string().max(150)
}).with('task', 'priority');

validateTodoDatas = (ownerId, todoData)=>{
  return new Promise((resolve, reject)=>{
    console.log(ownerId);
    console.log(todoData);
    todoData.owner = ownerId;
    console.log(todoData);
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
        reject(errorAnswer);

      } else {
        reject({
          report: 'Unexpected error!',
          involvedId: error.details,
          message: 'Data verification error!'
        });
      }
    } else
      resolve(value);
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
