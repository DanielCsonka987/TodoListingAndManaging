const Joi = require('joi');
const mongodbid = require('../../config/appConfig').mongodbid_regexp;
const SchemaCookie = Joi.string().pattern(new RegExp(mongodbid))
  .max(24).required();


validationCookieContent = (cookieValue)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaCookie.validate(cookieValue);
    if(error){
      if(error.name === 'ValidationError'){
        reject({
          report: 'Bad cookie in structure or content!',
          involvedId: cookieValue,
          message: 'Authentication error!'
        });
      }else{
        reject({
          report: 'Bad structured or cookie!',
          involvedId: cookieValue,
          message: 'Authentication error!'
        });
      }
    }else{
      resolve(cookieValue);
    }
  });
}

module.exports = validationCookieContent;
