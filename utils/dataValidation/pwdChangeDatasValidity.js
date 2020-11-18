const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js')
  .validation_config.password_regexp;
const errorMessages = require('../../config/appMessages.js').front_error_messages;

const SchemaPwdChange = Joi.object({
  new_password: Joi.string().pattern(new RegExp(passwordRegexp)).required(),
  old_password: Joi.string().pattern(new RegExp(passwordRegexp)).required()
});

module.exports = (pwdChangeData) =>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaPwdChange.validate(pwdChangeData);

    if(error){
      if(error.name){

        const problematicId = error.details[0].context.label;
        // const errorCaused = errorCaused.replace('_',' ');
        reject({
          report: 'Validation error!',
          involvedId: {field: problematicId, input: pwdChangeData[problematicId]},
          message: errorMessages.password_new_old_mismatch
        });

      } else{
        reject({
          report: `Unexpected error - ${error.name}!`,
          involvedId: {field: '', input: ''},
          message: errorMessages.password_new_old_mismatch
        });
      }
    } else {
      resolve(value);
    }

  })
}
