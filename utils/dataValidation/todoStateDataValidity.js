const Joi = require('joi');
const trueFalseDef = require('../../config/appConfig.js').true_false_regexp;

const SchemaTodoState = Joi.string().pattern(new RegExp(trueFalseDef)).required();

module.exports = (stateChangeInput)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaTodoState.validate(stateChangeInput);

    if(error){
      reject({
        report: 'Todo state is not a permitted content!',
        involvedId: 'state',
        mesasge: 'Todo state must be true or false!'
      });
    }else{
      resolve(value);
    }
  })
}
