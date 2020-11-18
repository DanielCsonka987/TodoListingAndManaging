const verifyLoginDatas = require('../utils/dataValidation/loginDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const pwdHashMatchVerify = require('../utils/passwordManagers.js').verifyThisPassword;

const doneMessages = require('../config/appMessages.js').front_success_messages;
const errorMessages = require('../config/appMessages.js').front_error_messages;

module.exports.loginDatasRevision = function(req, res, next){
  verifyLoginDatas(req.body)
  .then(res=>{ next() })
  .catch(err=>{
    res.status(400);   //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}
module.exports.loginProfileExistenceRevision = function(req, res, next){
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result=>{
    if(Object.keys(result.report).length === 0){   // NO RESULT
      res.status(400)
      res.send(JSON.stringify({
        report: 'Not correct username is sent!',
        involvedId: {field: 'username', input: req.body.username},
        message: errorMessages.password_login_validation
      }))
    } else{
      req.loginUserId = result.report._id;  //for the cookie content
      req.loginUserHashPwd = result.report.password;  //for authenticate
      next();
    }
  })
  .catch(err=>{
    res.status(400);  //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}

module.exports.pathQueryRevisionWithExistingProf = (req, res, next)=>{
  if(req.loginUserId.toString() === req.params.id){
    next();
  }else{
    res.status(400)
    res.send(JSON.stringify({
      report: 'Not correct path ID!',
      involvedId: {pathID: req.params.id},
      message: errorMessages.cookie_profile_mismatch
    }))
  }

}
module.exports.loginPasswordRevision = function(req, res, next){
  pwdHashMatchVerify(req.body.password, req.loginUserHashPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);  //NOT FOUND
      res.send(JSON.stringify({
        report: 'Password authentication failed at login!',
        involvedId: '',
        message: errorMessages.password_login_validation
      }))

    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.send(JSON.stringify({
        report: 'Password hash verification error at login!',
        involvedId: 'username or password',
        message: errorMessages.authentication_unknown
      }))
    }
  })
}
