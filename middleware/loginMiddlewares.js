const verifyLoginDatas = require('../utils/validation/loginDatasValidity.js');
const pwdHashMatchVerify = require('../utils/passwordManagers.js').verifyThisPassword;
const model = require('../model/ProfileModel.js');
const loginView = require('../view/middleView').forLogin
const createSessionCookie = require('../utils/cookieManagers').createSessionCookieAtResObj


module.exports.loginSteps = [
  loginDatasRevision, loginProfileExistenceRevision,
  urlParamRevisionWithExistingProfId, loginPasswordRevision,
  readProfileDetailsAndLogin
]

function loginDatasRevision(req, res, next){
  verifyLoginDatas(req.body)
  .then(res=>{ next() })
  .catch(err=>{
    res.status(400);
    res.json(loginView.noProperLoginDatas);
  });
}
function loginProfileExistenceRevision(req, res, next){
  model.findThisByUsername(req.body.username, result=>{
    if(result.status === 'success'){
      req.loginUserId = result.report.id;  //for the cookie content
      req.loginUserHashPwd = result.report.pwdHash;  //for authenticate
      next();
    } else{
      res.status(400)
      res.json(loginView.noSuchUserInSystem) 
    }
  })
}

function urlParamRevisionWithExistingProfId(req, res, next){
  if(req.loginUserId.toString() === req.params.id){
    next();
  }else{
    res.status(400)
    res.json(loginView.differentParamAndUserid)
  }

}
function loginPasswordRevision(req, res, next){
  pwdHashMatchVerify(req.body.password, req.loginUserHashPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);
      res.json(loginView.passwordNotAcceptable)
    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.json(loginView.passwordTestError)
    }
  })
}

function readProfileDetailsAndLogin(req, res){
  model.findThisProfileToLogin(req.params.id, result =>{
    if(result.status === 'success'){
      try{
        createSessionCookie(res, req.loginUserId.toString());
        res.status(200);
        res.json( loginView.loginSuccess(result.report) );

      }catch(e){
        res.status(400);
        res.json( loginView.loginFail(result) )
      }
    }else{
      res.status(500);
      res.json( loginView.loginFail(result) )
    }
  })
}
