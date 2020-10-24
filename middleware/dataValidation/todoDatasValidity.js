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
    if(error)
      return reject(error);
    else
      return resolve(value);
  });
}

module.exports = validateTodoDatas;
