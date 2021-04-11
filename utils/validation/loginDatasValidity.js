const Joi = require('joi');
const usernamedRegexp = require('../../config/appConfig.js').validation
  .username_regexp;
const pwdMinMax = require('../../config/appConfig').validation
  .password
const SchemaLogin = Joi.object({
  username: Joi.string().min(pwdMinMax[0]).max(pwdMinMax[1]).required(),
  password: Joi.string().min(pwdMinMax[0]).max(pwdMinMax[1]).required()
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
