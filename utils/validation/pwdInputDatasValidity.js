const Joi = require('joi');;
const pwdMinMax = require('../../config/appConfig').validation
  .password

const SchemaOldNewPwdChange = Joi.object({
  new_password: Joi.string().min(pwdMinMax[0]).max(pwdMinMax[1]).required(),
  old_password: Joi.string().min(pwdMinMax[0]).max(pwdMinMax[1]).required()
});

const SchemaOldPwdRevise = Joi.string().min(pwdMinMax[0]).max(pwdMinMax[1]).required()

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