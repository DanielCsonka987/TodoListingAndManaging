const Joi = require('joi');
const trueFalseDef = require('../../config/appConfig.js')
  .validation_config.true_false_regexp;

const SchemaTodoState = Joi.string().pattern(new RegExp(trueFalseDef)).required();

module.exports = (stateChangeInput)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaTodoState.validate(stateChangeInput);

    if(error){
      reject({
        report: 'Validation error!',
        involvedId: {field: 'status', input: stateChangeInput },
        message: 'Todo state must be true or false!'
      });
    }else{
      resolve(value);
    }
  })
}
