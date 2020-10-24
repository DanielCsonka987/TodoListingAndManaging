const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js').password_regexp;
const SchemaProfile = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp)),
  password_repeat: Joi.ref('password'),
  first_name: Joi.string().max(80),
  last_name: Joi.string().max(80),
  occupation: Joi.string().max(50),
  age: Joi.number().integer().min(5).max(120)
}).with('username', 'password')
.and().with('password', 'password_repeat')
.and().with('username', 'first_name');

validateProfileDatas = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaProfile.validate(profileData);

    if(error)
      return reject(error);
    else
      return resolve(value);
  });

}

module.exports = validateProfileDatas;
