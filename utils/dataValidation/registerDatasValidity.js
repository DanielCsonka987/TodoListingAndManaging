const Joi = require('joi');
const passwordRegexp = require('../../config/appConfig.js')
  .validation_config.password_regexp;
const SchemaRegister = Joi.object({
  username: Joi.string().min(4).max(80).required(),
  password: Joi.string().pattern(new RegExp(passwordRegexp)).required(),
  password_repeat: Joi.ref('password'),
  first_name: Joi.string().max(80).required(),
  last_name: Joi.string().max(80),
  occupation: Joi.string().max(50),
  age: Joi.number().integer().min(5).max(120)
}).with('password', 'password_repeat');

module.exports = (profileData)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaRegister.validate(profileData);

    if(error){
      if(error.name === 'ValidationError'){
        let problematicField = error.details[0].context.key;

        if(problematicField === undefined) //in case if no password_repeat
          problematicField = error.details[0].context.peer;

        let errorAnswer = {
          report: 'Validation error!',
          involvedId: { field: problematicField, input: profileData[problematicField] }
        }

        if(errorAnswer.involvedId.field === 'username')
          errorAnswer.message = 'The chosen username is not permitted!';
        else if(errorAnswer.involvedId.field === 'password')
          errorAnswer.message = 'The chosen password is not permitted!';
        else if(errorAnswer.involvedId.field === 'password_repeat')
          errorAnswer.message = 'No match between the password and its confirmation!';
        else {

          let involvedKey = problematicField.replace('_','');
          errorAnswer.message = `This ${involvedKey} is not permitted!`;
        }
        reject(errorAnswer);

      } else {
        reject({
          report: `Unexpected error - ${error.name}!`,
          involvedId: {field: '' , input: ''},
          message: 'Data verification error!'
        });
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
