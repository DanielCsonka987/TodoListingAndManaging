const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js').password_regexp;
const SchemaProfile = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp)),
  password_repeat: Joi.ref('password'),
  first_name: Joi.string().max(80).required(),
  last_name: Joi.string().max(80),
  occupation: Joi.string().max(50),
  age: Joi.number().integer().min(5).max(120)
}).with('password', 'password_repeat');

validateProfileDatas = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaProfile.validate(profileData);

    if(error){
      if(error.name === 'ValidationError'){
        let errorAnswer = {
          report: 'Validation error!',
          involvedId: error.details[0].context.key
        }
        if(errorAnswer.involvedId === 'username')
          errorAnswer.message = 'The chosen username is not permitted!';
        else if(errorAnswer.involvedId === 'password')
          errorAnswer.message = 'The chosen password is not permitted!';
        else if(errorAnswer.involvedId === 'password_repeat')
          errorAnswer.message = 'No match between the password and its confirmation!';
        else {
          let involvedKey = errorAnswer.involvedId.replace('_','');
          errorAnswer.message = `This ${involvedKey} is not permitted`;
        }
        return reject(errorAnswer);

      } else {
        return reject({
          report: error.name,
          involvedId: error.details,
          message: 'Data verification error!'
        });
      }
    } else
      return resolve(value);
  });
}

testValidateProfileDatas = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaProfile.validate(profileData);
    if(error)
      return reject(error);
    else
      return resolve(value);
  });
}

module.exports.validation = validateProfileDatas;
module.exports.testValidation = testValidateProfileDatas;
