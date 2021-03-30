const Joi = require('joi');
const mongodbid = require('../../config/appConfig.js').validation.mongodbid_regexp;

const SchemaCookie = Joi.string().pattern(new RegExp(mongodbid))
  .max(24).required();

module.exports = (cookieValue)=>{
  return new Promise((resolve, reject)=>{
    const {error, value} = SchemaCookie.validate(cookieValue);
    if(error){
      reject(null);
    }else{
      resolve(cookieValue);
    }
  });
}
