const verifySessionCookie = require('../utils/validation/sessionIdValidity.js');
const model = require('../model/ProfileModel.js');
const cookieView = require('../view/middleView.js').forCookies;

const sessionCookieName = sessionCookieAttributes().name;




module.exports.cookieRevisionSteps = [
  existenceTest, contentStrTest, contentDBTest, sessionCookieRenew
]

const existenceTest = (req, res, next)=>{
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
const contentStrTest = (req, res, next)=>{
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
const contentDBTest = (req, res, next)=>{
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
const sessionCookieRenew = (req, res, next)=>{
  createSessCookie(res, req.cookies[sessionCookieName]);
  next();
}



// FRONT REQUEST IF COOKIE IS STILL ACCEPTABLE
module.exports.reviseLoggedInState = (req, res, next) =>{
  const cookieContentIsThere = req.cookies[sessionCookieName]?true:false;
  res.write(JSON.stringify(
      cookieView.cookieLoggedInStateMsg(cookieContentIsThere)
  ))
  next();
}