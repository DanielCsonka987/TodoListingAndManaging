const Joi = require('joi');;
const pwdTextMax = require('../../config/appConfig').validation.pwd_text_max
const pwdTextMin = require('../../config/appConfig').validation.pwd_text_min

const SchemaOldNewPwdChange = Joi.object({
  new_password: Joi.string().min(pwdTextMin).max(pwdTextMax).required(),
  old_password: Joi.string().min(pwdTextMin).max(pwdTextMax).required()
});

const SchemaOldPwdRevise = Joi.string()
  .min(pwdTextMin).max(pwdTextMax).required();

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