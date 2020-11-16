const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js')
  .validation_config.password_regexp;
const errorMessages = require('../../config/appConfig.js').front_error_messages;

const SchemaLogin = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp))
}).with('username', 'password');

module.exports = (loginData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaLogin.validate(loginData);

    if(error){
      if(error.name){
        reject({
          report: 'Validation error!',
          involvedId: 'username or password',
          message: errorMessages.password_login_validation
        });
      }else{
        reject({
          report: 'Login verification error!',
          involvedId: '',
          message: errorMessages.password_login_validation
        });
      }
    } else
      resolve(value);
  });
}
