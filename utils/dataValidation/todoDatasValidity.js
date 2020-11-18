const Joi = require('joi');
const mongodbid = require('../../config/appConfig')
  .validation_config.mongodbid_regexp;
const SchemaTodo = Joi.object({
  owner: Joi.string().pattern(new RegExp(mongodbid)).max(24).required(),
  task: Joi.string().max(150).required(),
  priority: Joi.number().min(0).max(10),
  notation: Joi.string().max(150)
}).with('task', 'priority');

module.exports = (ownerId, todoData)=>{
  return new Promise((resolve, reject)=>{
    todoData.owner = ownerId;
    const {error, value} = SchemaTodo.validate(todoData);

    if(error){
      if(error.name === 'ValidationError'){
        const problematicId = error.details[0].context.key;
        let errorAnswer = {
          report: 'Validation error!',
          involvedId: { field: problematicId , input: todoData[problematicId] }
        };
        if(errorAnswer.involvedId.field === 'owner')
          errorAnswer.message = 'Missing profile identifier!';
        else if(errorAnswer.involvedId.field === 'task')
          errorAnswer.message = 'Missing task description!';
        else if(errorAnswer.involvedId.field === 'priority')
          errorAnswer.message = 'Missing priority indicator!';
        else
          errorAnswer.message = `The ${problematicId} value is problematic!`;
        reject(errorAnswer);

      } else {
        reject({
          report: `Unexpected error - ${error.name}!`,
          involvedId: { field: '', input: '' },
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
