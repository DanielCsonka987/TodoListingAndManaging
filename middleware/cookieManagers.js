const verifySessionCookie = require('../utils/dataValidation/cookieDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const sessionCookieAttributes = require('../utils/sessionCookieAttribs.js');

const sessionCookieName = sessionCookieAttributes().name;
const errorMessage = require('../config/appMessages.js').front_error_messages;

module.exports.existVerification = (req, res, next)=>{
  if(req.cookies !== undefined){
    if(req.cookies[sessionCookieName] === req.params.id || req.cookies[sessionCookieName] !== undefined){
      next();
    } else {
      res.status(401)   //UNAUTHORIZED
      res.send(JSON.stringify({
        report: 'User interfering in another account!',
        involvedId: req.params.id,
        message: errorMessage.cookie_profile_mismatch
      }));
    }
  } else {  //NO COOKIE AT ALL
    res.status(401)   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'User session is not set!',
      involvedId: 'sessionCookie',
      message: errorMessage.cookie_misses
    }));
  }
}

module.exports.contentVerification = (req, res, next)=>{
  const cookieContentToAnalyze = req.cookies[sessionCookieName];
  if(cookieContentToAnalyze){
    verifySessionCookie(cookieContentToAnalyze)  //structural and DB revision
    .then(possGoodCookieId =>{
      req.possGoodIdFromCookie = possGoodCookieId;
      next();
    })
    .catch((err)=>{
      res.status(401);    //UNAUTHORIZED
      res.send(JSON.stringify(err));
    })
  } else {  //NOT ACCEPTABLE VALUE IN SESSION COOKIE
    res.status(401);   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'No cookie value to authenticate!',
      involvedId: '',
      message: errorMessage.cookie_misses
    }));
  }
}


module.exports.contentDBRevision = (req, res, next)=>{
  modelProfile.findThisProfileById_detailed(req.possGoodIdFromCookie)
  .then(result=>{
    req.oldHashedPwd = result.report.password;  //SAVING IN CASE OF INPUT old_password REVISION
    next();
  }).catch(err=>{
    err.message = errorMessage.cookie_misses;
    res.status(401);    //UNAUTHORIZED
    res.send(JSON.stringify(err));
  })
}



function createSessionCookieAtResponseObj(res, value){
  const cookieAttrib = sessionCookieAttributes();
  res.cookie(cookieAttrib.name, value.toString(),
    {
      path: cookieAttrib.path,
      expires: cookieAttrib.expireDate,
      httpOnly: cookieAttrib.httpOnly,
      secure: cookieAttrib.secure,
      sameSite: cookieAttrib.sameSite
    }
  );
}
function removeSessionCookieAtResponseObj(res, value){
  const cookieAttrib = sessionCookieAttributes();
  res.cookie(cookieAttrib.name, value,
    {
      path: cookieAttrib.path,
      expires: 0,
      httpOnly: cookieAttrib.httpOnly,
      secure: cookieAttrib.secure,
      sameSite: cookieAttrib.sameSite
    }
  );
}

module.exports.sessionCookieRegisterCreation = (req, res, next)=>{
  const newUserId = req.justCreatedUserMessage.report.id;
  createSessionCookieAtResponseObj(res, newUserId);
  res.status(201);
  res.write(JSON.stringify(req.justCreatedUserMessage));
  next();
}

module.exports.sessionCookieRenew = (req, res, next)=>{
  if(req.cookies[sessionCookieName]){
    createSessionCookieAtResponseObj(res, req.cookies[sessionCookieName]);
  }
  next();
}

module.exports.sessionCookieLoginCreation = (req, res, next)=>{
  createSessionCookieAtResponseObj(res, req.loginUserId);
  next();
}


module.exports.sessionCookieRemoval = (req, res, next)=>{
  removeSessionCookieAtResponseObj(res, '');
  next();
}
