const Joi = require('joi');;
const passwordRegexp = require('../../config/appConfig').validation
  .password_regexp

const SchemaOldNewPwdChange = Joi.object({
  new_password: Joi.string().pattern(new RegExp(passwordRegexp)).required(),
  old_password: Joi.string().pattern(new RegExp(passwordRegexp)).required()
});

const SchemaOldPwdRevise = Joi.string().pattern(new RegExp(passwordRegexp)).required()

module.exports.pwdChangeInputPairRevise = (pwdChangeData) =>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaOldNewPwdChange.validate(pwdChangeData);
    if(error){
      if(error.name){
        const problematicId = error.details[0].context.label;
        reject(problematicId);
      } else{
        reject('unexpected');
      }
    } else {
      resolve(value);
    }
  })
}

module.exports.pwdContentRevise = (pwdText) =>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaOldPwdRevise.validate(pwdText);
    if(error){
      if(error.name){
        reject('old_password');
      } else{
        reject('unexpected');
      }
    } else {
      resolve(value);
    }
  })
}