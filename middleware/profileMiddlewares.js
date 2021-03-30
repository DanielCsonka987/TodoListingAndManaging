const pwdInputDataValidator = require('../utils/validation/pwdInputDatasValidity.js');
const pwdManager = require('../utils/passwordManagers.js');
const model = require('../model/ProfileModel');
const profView = require('../view/middleView').forProfiles
const removeSessionCookie = require('./cookieManagers')
  .removeSessionCookieAtResObj

module.exports.readPublicPrfilesSteps = [
  readAllProfiles
]
module.exports.pwdChangeSteps = [
  profileUpdateContentVerification, profileOldPwdConfirmation,
  profileNewPwdEncoding, profilePwdUpdate
]
module.exports.removeAccountSteps = [
  profileDeletePasswordRevise, profileOldPwdConfirmation,
  profileDeletionAndLogout
]

const readAllProfiles = (req, res, next)=>{
  model.collectAllProfiles((result)=>{
    if(result.status === 'success'){
      res.status(200);
      res.json( profView.readPublicProfilesSuccess(result) );
      next();
    }else{
      res.status(500);    //SERVER INTERNAL ERROR
      res.json( profView.readPublicProfilesFail(result));
    }
  })
}


const profileOldPwdConfirmation = (req, res, next)=>{
  //console.log(req.oldHashedPwd)
  pwdManager.verifyThisPassword(req.body.old_password, req.oldHashedPwd)  
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(200);
      res.json( profView.pwdHashRevisionFail )
    } else {
      res.status(500);
      res.json( profView.pwdHashRevisionError )
    }
  })
}



//it is needed at password update + account delete, pwdHash comming from cookie middle
const profileUpdateContentVerification = (req, res, next)=>{
  pwdInputDataValidator.pwdChangeInputPairRevise(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(200);
    res.json( profView.pwdRevisionFailed(err) );
  });
}
const profileNewPwdEncoding = (req, res, next)=>{
  pwdManager.encodeThisPassword(req.body.new_password)
  .then(hashResult=>{
    req.newHashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);
    res.json( profView.pwdHashFailed );
  })
}

const profilePwdUpdate = (req, res)=>{
  model.changePwdInProfile(req.params.id, req.newHashedPassword, result=>{
    if(result.status === 'success' ){
      res.status(200);
      res.json( profView.pwdUpdateSuccess(result) );
      
    }else {
      res.status(500);
      res.json( profView.pwdUpdateFailed(err) )
    }
  })
}




// REMOVE COOKIE //
const profileDeletePasswordRevise = (req, res, next)=>{
  pwdInputDataValidator.pwdContentRevise(req.body)
  .then(()=>{
    next();
  })
  .catch(err=>{
    res.status(200)
    res.json( profView.pwdRevisionFailed(err))
  })
}
const profileDeletionAndLogout = (req, res ) =>{
  model.removeThisProfile(req.params.id, result=>{
    if(result === 'success'){
      removeSessionCookie(res, '');
      res.status(200)
      res.json( profView.profDelsuccess(result) )
    }else{
      res.status(500);
      res.json( profView.profDelFailed(result) )
    }
  })
}
