const verifySessionCookie = require('../utils/validation/sessionIdValidity.js');
const model = require('../model/ProfileModel.js');
const cookieView = require('../view/middleView.js').forCookies;

const sessionCookieName = require('../config/appConfig').cookie.sessionCookieNameing;
const createSessCookie = require('../utils/cookieManagers').createSessionCookieAtResObj

module.exports.cookieRevisionSteps = [
  existenceTest, contentStrTest, contentDBTest, sessionCookieRenew
]

function existenceTest(req, res, next){ 
  if(req.cookies === undefined ||  req.cookies[sessionCookieName] === undefined){
    res.status(200)
    res.json( cookieView.generalProblemMsg );
  } else { 
    if(req.cookies[sessionCookieName] !== req.params.id ){
         res.status(200)
         res.json( cookieView.paramMissmatchMsg );
    } else {
      next();
    }
  }
}
function contentStrTest(req, res, next){
  verifySessionCookie(req.cookies[sessionCookieName])  //structural revision
  .then(possGoodCookieId =>{
    req.sessionCookie = possGoodCookieId;
    next();
  })
  .catch((err)=>{
    res.status(200);  //somehow it is empty, ex. logged in later
    res.json( cookieView.generalProblemMsg ); 
  })

}
function contentDBTest(req, res, next){
  model.findThisById(req.sessionCookie, dbresult=>{
    if(dbresult.status === 'success'){
      req.oldHashedPwd = dbresult.report.pwdHash;  //SAVING IN CASE OF INPUT old_password REVISION
      next();
    }else{
      res.status(200);
      res.json( cookieView.generalProblemMsg );
    }
  })
}
function sessionCookieRenew(req, res, next){
  createSessCookie(res, req.cookies[sessionCookieName]);
  next();
}



// FRONT REQUEST IF COOKIE IS STILL ACCEPTABLE
module.exports.reviseLoggedInState = (req, res) =>{
  const cookieContentIsThere = req.cookies[sessionCookieName]?true:false;
  res.status(200)
  res.json( cookieView.cookieLoggedInStateMsg(cookieContentIsThere) )
}