const verifySessionCookie = require('../utils/validation/sessionIdValidity.js');
const model = require('../model/ProfileModel.js');
const cookieView = require('../view/middleView.js').forCookies;

const sessionCookieName = require('../config/appConfig').cookie.sessionCookieNameing;
const createSessCookie = require('../utils/cookieManagers').createSessionCookieAtResObj

module.exports.cookieRevisionSteps = [
  existenceTest1, contentStrTest, contentDBTest, sessionCookieRenew
]

// FRONT REQUEST IF COOKIE IS STILL ACCEPTABLE
module.exports.reviseLoggedInState = [
  existenceTest2, contentStrTest, collectAllTodosOfUser ]

function existenceTest1(req, res, next){ 
  if(req.cookies === undefined ||  req.cookies[sessionCookieName] === undefined){
    res.status(200)
    res.json( cookieView.generalProblemMsg );
  } else { 
    if(req.cookies[sessionCookieName] !== req.params.id ){
         res.status(400)
         res.json( cookieView.paramMissmatchMsg );
    } else {
      next();
    }
  }
}
function contentStrTest(req, res, next){
  verifySessionCookie(req.cookies[sessionCookieName])  //structural revision
  .then(possGoodCookieId =>{
    next();
  })
  .catch((err)=>{
    res.status(200);  //somehow it is empty, ex. logged in later
    res.json( cookieView.generalProblemMsg ); 
  })

}
function contentDBTest(req, res, next){
  model.findThisById(req.cookies[sessionCookieName], dbresult=>{
    if(dbresult.status === 'success'){
      req.oldHashedPwd = dbresult.report.pwdHash;  //SAVING IN CASE OF INPUT old_password REVISION
      next();
    }else{
      res.status(400);
      res.json( cookieView.generalProblemMsg );
    }
  })
}
function sessionCookieRenew(req, res, next){
  createSessCookie(res, req.cookies[sessionCookieName]);
  next();
}

function existenceTest2(req, res, next){ 
  if(req.cookies === undefined ||  req.cookies[sessionCookieName] === undefined){
      res.status(200)
      res.json( cookieView.loggedInStateMsg(false, '') );
  } else { 
    next();
  }
}

function collectAllTodosOfUser(req, res){
  model.collectAllTodos(req.cookies[sessionCookieName], result=>{
    if(result.status === 'success'){
      res.status(200)
      res.json(  cookieView.loggedInStateMsg( true, result.report) )
    }else{
      res.status(400)
      res.json(  cookieView.generalProblemMsg )
    }
  })
}