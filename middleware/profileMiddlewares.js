const pwdChangeDataValidity = require('../utils/dataValidation/pwdChangeDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const pwdManager = require('../utils/passwordManagers.js');

module.expots.profileUpdateContentVerification = (req, res, next)=>{
  loginDataValidity(req.body)
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

module.exports.profileOldPwdConfirmation = (req, res, next)=>{
  pwdManager.verifyThisPassword(req.body.old_password, req.oldHashedPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);  //BAD REQUEST
      res.send(JSON.stringify({
        report: 'Old password missmatch!',
        involvedId: 'oldpassword',
        message: 'Wrong actual password!!'
      }))
    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.send(JSON.stringify({
        report: 'Old password verification error!',
        involvedId: 'oldpassword',
        message: 'Password update error!'
      }))
    }
  })
}

module.exports.profileNewPwdEncoding = (req, res, next)=>{
  pwdManager.encodeThisPassword(req.body.password)
  .then(hashResult=>{
    req.newHashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify({
      report: 'New password encription error!',
      involvedId: 'password',
      message: 'Password update error!'
    }));
  })
}
