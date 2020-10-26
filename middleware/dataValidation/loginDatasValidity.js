const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js').password_regexp;

const SchemaLogin = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp))
}).with('username', 'password');

validationLoginPwd = (loginData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaLogin.validate(loginData);

    if(error){
      if(error.name){
        reject({
          report: 'Validation error!',
          involvedId: '',
          message: 'Wrong username or password!'
        });
      }else{
        reject({
          report: 'Unexpected error!',
          involvedId: error.details,
          message: 'Data verification error!'
        });
      }
    } else
      resolve(value);
  });
}

module.exports = validationLoginPwd;
