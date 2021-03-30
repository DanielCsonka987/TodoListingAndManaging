const Joi = require('joi');
const piroityMax = require('../../config/appConfig').validation.priority_max
const piroityMin = require('../../config/appConfig').validation.priority_min
const taskNotationMax = require('../../config/appConfig').validation
  .task_notation_max

const SchemaTodo = Joi.object({
  task: Joi.string().max(taskNotationMax).required(),
  priority: Joi.number().min(piroityMin).max(piroityMax).required(),
  notation: Joi.string().max(taskNotationMax)
});

module.exports = (todoData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaTodo.validate(todoData);
    if(error){
      if(error.name === 'ValidationError'){
        const problematicId = error.details[0].context.label;
        reject(problematicId);
      } else {
        reject('unexpected');
      }
    } else
      resolve(value);
  });
}

