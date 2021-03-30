const bcrypt = require('bcrypt');
const encryptRound = require('../config/appConfig.js').validation
  .encryption_saltrounds;
const actPwdLengthStandard = require('../config/appConfig').validation
  .actPwdLengthStandard;

module.exports.encodeThisPassword = (newPassword)=>{
  return new Promise((resolve, reject)=>{
    if(newPassword === undefined)
      reject(null);
    if(newPassword === '')
      reject(null);
      
    bcrypt.hash(newPassword, encryptRound)
    .then(hashResult =>{
      resolve(hashResult);
    })
    .catch(err=>{
      reject(null);
    })
  })
}

module.exports.verifyThisPassword = (plainTextPwd, hashedPwd)=>{
  return new Promise((resolve, reject)=>{
    if(plainTextPwd === '')
      reject('incorrect');
    if(hashedPwd === undefined)
      reject('error')
    if(hashedPwd.length !== actPwdLengthStandard)
      reject('error')

    bcrypt.compare(plainTextPwd, hashedPwd)
    .then(verifResult=>{
      if(verifResult){
        resolve(plainTextPwd);
      } else {
        reject('incorrect');
      }
    })
    .catch(err=>{
      reject('error');
    })
  })
}
