const Joi = require('joi');
const mongodbid = require('../../config/appConfig.js').validation_config.mongodbid_regexp;
const errorMessages = require('../../config/appMessages.js').front_error_messages;
const SchemaCookie = Joi.string().pattern(new RegExp(mongodbid))
  .max(24).required();

module.exports = (cookieValue)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaCookie.validate(cookieValue);
    if(error){
      if(error.name === 'ValidationError'){
        reject({
          report: 'Bad cookie in structure or content!',
          involvedId: {cookieContent: cookieValue},
          message: errorMessages.authentication_unknown
        });
      }else{
        reject({
          report: 'Bad structured or cookie!',
          involvedId: {cookieContent: cookieValue},
          message: errorMessages.authentication_unknown
        });
      }
    }else{
      resolve(cookieValue);
    }
  });
}
