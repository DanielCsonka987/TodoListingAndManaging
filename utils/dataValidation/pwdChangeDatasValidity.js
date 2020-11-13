const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js').password_regexp;

const SchemaPwdChange = Joi.object({
  password: Joi.string().pattern(new RegExp(passwordRegexp)).required(),
  old_password: Joi.string().pattern(new RegExp(passwordRegexp)).required()
});

module.exports = (pwdChangeData) =>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaPwdChange.validate(pwdChangeData);

    if(error){
      if(error.name){

        let errorCaused = error.details[0].context.label;
        if(errorCaused === 'old_password'){
          errorCaused = errorCaused.replace('_',' ');
        }
        reject({
          report: 'Validation error!',
          involvedId: errorCaused,
          message: 'Wrong new password or original password!'
        });


      } else{
        reject({
          report: 'Unexpected error!',
          involvedId: error.details,
          message: 'Data verification error!'
        });
      }
    } else {
      resolve(value);
    }

  })
}
