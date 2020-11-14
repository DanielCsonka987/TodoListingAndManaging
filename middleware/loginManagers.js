const verifyLogin = require('../utils/dataValidation/loginDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const pwdVerify = require('../utils/passwordManagers.js').verifyThisPassword;

module.exports.loginDatasRevision = function(req, res, next){
  verifyLogin(req.body)
  .then(res=>{ next() })
  .catch(err=>{
    res.status(400);   //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}
module.exports.loginProfileExistenceRevision = function(req, res, next){
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result=>{
    req.loginUserId = result.report._id;  //for the cookie content
    req.loginUserHashPwd = result.report.password;  //for authenticate
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  });
}
module.exports.loginPasswordRevision = function(req, res, next){
  console.log(req.body.password+ '-'+ req.loginUserHashPwd)
  pwdVerify(req.body.password, req.loginUserHashPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(404);  //NOT FOUND
      res.send(JSON.stringify({
        report: 'Authentication failed!',
        involvedId: '',
        message: 'Wrong username or password!!'
      }))

    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.send(JSON.stringify({
        report: 'Password inseption failed!',
        involvedId: 'username or password',
        message: 'Authentication error!'
      }))
    }
  })
}
