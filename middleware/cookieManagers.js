const verifySessionCookie = require('../utils/dataValidation/cookieDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const sessionCookieAttributes = require('../utils/sessionCookieAttribs.js');

const sessionCookieName = sessionCookieAttributes().name;
const errorMessage = require('../config/appConfig.js').front_error_messages;

module.exports.existVerification = (req, res, next)=>{
  if(req.cookies !== undefined){
    if(req.cookies[sessionCookieName] === req.params.id || req.cookies[sessionCookieName] !== undefined){
      next();
    } else {  //NO COOKIE VALUE OR NO SESSION COOKIE
      // const actPathId = req.params.id;
      // if(actPathId === 'register')
      //   next();
      // if(actPathId === 'login')
      //   next();
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
    verifyStructureContentCookie(cookieContentToAnalyze)  //structural and DB revision
    .then(result=>{
      next();
    })
    .catch(err=>{
      res.status(401);   //UNAUTHORIZED
      res.send(JSON.stringify(err))
    });
  } else {  //NOT ACCEPTABLE VALUE IN SESSION COOKIE
    res.status(401);   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'No cookie value to authenticate!',
      involvedId: '',
      message: errorMessage.cookie_misses
    }));
  }
}


function verifyStructureContentCookie (cookieContent){
  return new Promise((resolve, reject)=>{
    verifySessionCookie(cookieContent)
    .then(result=>{
      modelProfile.findThisProfileById(cookieContent)
      .then(res=>{ resolve() })
      .catch((err)=>{
        let newReport = '';
        if(err.report === 'MongoDB error!'){
          newReport = 'Connection issue';
        } else {
          newReport = 'Unkonwn identifier';
        }
        const errorMesasge = {
          report: `Cookie value inappropiate - ${newReport}!`,
          involvedId: '',
          message: errorMessage.cookie_revision
        }
        reject(errorMesasge)
      });
    })
    .catch(err=>{
      reject(err);
    });
  });
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
module.exports.sessionCookieRenew = (req, res, next)=>{
  if(req.cookies[sessionCookieName]){
    createSessionCookieAtResponseObj(res, req.cookies[sessionCookieName]);
    // const cookieAttrib = sessionCookieAttributes();
    // res.cookie(sessionCookieName,
    //   req.cookies[sessionCookieName],
    //   {
    //     path: cookieAttrib.path,
    //     expires: cookieAttrib.expireDate,
    //     httpOnly: cookieAttrib.httpOnly,
    //     secure: cookieAttrib.secure,
    //     sameSite: cookieAttrib.sameSite
    //   }
    // );
  }
  next();
}

module.exports.sessionCookieLoginCreation = (req, res, next)=>{
  // const cookieAttrib = sessionCookieAttributes();
  createSessionCookieAtResponseObj(res, req.loginUserId);
  next();
}
module.exports.sessionCookieRegisterCreation = (res, idValue)=>{
  // const cookieAttrib = sessionCookieAttributes();
  createSessionCookieAtResponseObj(res, idValue);

}
module.exports.sessionCookieRemoval = (req, res, next)=>{
  removeSessionCookieAtResponseObj(res, '');
  next();
}
