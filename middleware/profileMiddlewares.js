const pwdInputDataValidator = require('../utils/validation/pwdInputDatasValidity.js');
const pwdManager = require('../utils/passwordManagers.js');
const model = require('../model/ProfileModel');
const profView = require('../view/middleView').forProfiles
const removeSessionCookie = require('../utils/cookieManagers').removeSessionCookieAtResObj

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

function readAllProfiles(req, res){
  model.collectAllProfiles((result)=>{
    if(result.status === 'success'){
      res.status(200);
      res.json( profView.readPublicProfilesSuccess(result.report) );
    }else{
      res.status(500);    //SERVER INTERNAL ERROR
      res.json( profView.readPublicProfilesFail);
    }
  })
}
function profileOldPwdConfirmation(req, res, next){
  pwdManager.verifyThisPassword(req.body.old_password, req.oldHashedPwd)  
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);
      res.json( profView.pwdHashRevisionFailed )
    } else {
      res.status(500);
      res.json( profView.pwdHashRevisionError )
    }
  })
}



//it is needed at password update + account delete, pwdHash comming from cookie middle
function profileUpdateContentVerification(req, res, next){
  pwdInputDataValidator.pwdChangeInputPairRevise(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400);
    res.json( profView.pwdRevisionFailed(err) );
  });
}
function profileNewPwdEncoding(req, res, next){
  pwdManager.encodeThisPassword(req.body.new_password)
  .then(hashResult=>{
    req.newHashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);
    res.json( profView.pwdHashingFailed );
  })
}
function profilePwdUpdate(req, res){
  model.changePwdInProfile(req.params.id, req.newHashedPassword, result=>{
    if(result.status === 'success' ){
      res.status(200);
      res.json( profView.pwdUpdateSuccess );
      
    }else {
      res.status(500);
      res.json( profView.pwdUpdateFailed )
    }
  })
}




// REMOVE PROFILE //
function profileDeletePasswordRevise(req, res, next){
  pwdInputDataValidator.pwdContentRevise(req.body.old_password)
  .then(()=>{
    next();
  })
  .catch(err=>{
    res.status(400)
    res.json( profView.pwdRevisionFailed(err))
  })
}
function profileDeletionAndLogout(req, res ){
  model.removeThisProfile(req.params.id, result=>{
    if(result.status === 'success'){
      removeSessionCookie(res);
      res.status(200)
      res.json( profView.profDelsuccess )
    }else{
      res.status(500);
      res.json( profView.profDelFailed )
    }
  })
}
