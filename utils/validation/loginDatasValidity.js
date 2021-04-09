const Joi = require('joi');
const usernamedRegexp = require('../../config/appConfig.js').validation
  .username_regexp;
const passwordRegexp = require('../../config/appConfig.js')
  .validation.password_regexp;

const SchemaLogin = Joi.object({
  username: Joi.string().pattern(new RegExp(usernamedRegexp)).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp)).required()
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
