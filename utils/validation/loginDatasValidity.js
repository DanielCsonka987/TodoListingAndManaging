const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js')
  .validation.password_regexp;

const SchemaLogin = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp))
}).with('username', 'password');

module.exports = (loginData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaLogin.validate(loginData);
    if(error){
      reject(null);
    } else
      resolve(value);
  });
}
