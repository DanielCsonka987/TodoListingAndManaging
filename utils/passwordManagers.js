const bcrypt = require('bcrypt');
const encryptRound = require('../config/appConfig.js').encryption_saltrounds;

module.exports.encodeThisPassword = ()=>{
  return new Promise((resolve, reject)=>{
    bcrypt.hash(req.body.password, encryptRound)
    .then(hashResult =>{
      resolve(hashResult);
    })
    .catch(err=>{
      reject();
    })
  })
}

module.exports.verifyThisPassword = (plainTextPwd, hashedPwd)=>{
  return new Promise((resolve, reject)=>{
    bcrypt.compare(plainTextPwd, hashedPwd)
    .then(verifResult=>{
      if(verifResult){
        resolve();
      } else {
        reject('incorrect');
      }
    })
    .catch(err=>{
      reject('error');
    })
  })
}
