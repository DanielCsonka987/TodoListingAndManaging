const Joi = require('joi');
const usernamedRegexp = require('../../config/appConfig.js').validation
  .username_regexp;
const pwdTextMax = require('../../config/appConfig').validation.pwd_text_max
const pwdTextMin = require('../../config/appConfig').validation.pwd_text_min
const nameMax = require('../../config/appConfig').validation.name_max
const occupMax = require('../../config/appConfig').validation.occupation_max
const ageMax = require('../../config/appConfig').validation.age_max
const ageMin = require('../../config/appConfig').validation.age_min

const SchemaRegister = Joi.object({
  username: Joi.string().pattern(new RegExp(usernamedRegexp)).required(),
  password: Joi.string().min(pwdTextMin).max(pwdTextMax).required(),
  password_repeat: Joi.ref('password'),
  first_name: Joi.string().max(nameMax).required(),
  last_name: Joi.string().max(nameMax),
  occupation: Joi.string().max(occupMax),
  age: Joi.number().integer().min(ageMin).max(ageMax)
}).with('password', 'password_repeat');

module.exports = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaRegister.validate(profileData);

    if(error){
      if(error.name === 'ValidationError'){
        let errorField = error.details[0].context.key;
        if(errorField === undefined) //in case if no password_repeat
          errorField = error.details[0].context.peer;
        reject(errorField);
      } else {
        reject('unexpected');
      }
    } else
      resolve(value);
  });
}

testValidateProfileDatas = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaRegister.validate(profileData);
    if(error)
      return reject(error);
    else
      return resolve(value);
  });
}
