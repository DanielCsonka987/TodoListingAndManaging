const pwdChangeDataValidity = require('../utils/dataValidation/pwdChangeDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const pwdManager = require('../utils/passwordManagers.js');
const errorMessages = require('../config/appConfig.js').front_error_messages;

module.exports.profileUpdateContentVerification = (req, res, next)=>{
  pwdChangeDataValidity(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400);  //BAD REQUEST
    res.send(JSON.strigify(err));
  });
}

module.exports.profileAccountExistVerification = (req, res, next)=>{
  modelProfile.findThisProfileById(req.params.id)
  .then(result =>{
    req.oldHashedPwd = result.report.password;
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  })
}

//it is needed at password update, todo deletions
module.exports.profileOldPwdConfirmation = (req, res, next)=>{
  pwdManager.verifyThisPassword(req.body.old_password, req.oldHashedPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);  //BAD REQUEST
      res.send(JSON.stringify({
        report: 'Old password is wrong!',
        involvedId: 'old_password',
        message: errorMessages.password_update_revise
      }))
    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.send(JSON.stringify({
        report: 'Password old-new inspection error!',
        involvedId: 'old_password',
        message: errorMessages.authentication_unknown
      }))
    }
  })
}

module.exports.profileNewPwdEncoding = (req, res, next)=>{
  pwdManager.encodeThisPassword(req.body.new_password)
  .then(hashResult=>{
    req.newHashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify({
      report: 'New password encription error!',
      involvedId: 'password',
      message: errorMessages.password_update_newHashing
    }));
  })
}
