const verifySessionCookie = require('../utils/dataValidation/cookieDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const sessionCookieAttributes = require('../utils/sessionCookieAttribs.js');

const sessionCookieName = sessionCookieAttributes().name;

module.exports.existVerification = (req, res, next)=>{
  console.log(req.params);
  if(req.cookies !== undefined){
    if(req.cookies[sessionCookieName] === req.params.id || req.cookies[sessionCookieName] !== undefined){
      next();
    } else {  //NO COOKIE VALUE OR NO SESSION COOKIE
      res.status(401)   //UNAUTHORIZED
      res.send(JSON.stringify({
        report: 'User interfering in another account!',
        involvedId: req.params.id,
        message: 'Management is permitted only at your account!'
      }));
    }
  } else {  //NO COOKIE AT ALL
    res.status(401)   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'User session is not set!',
      involvedId: 'sessionCookie',
      message: 'Please, log in to use such service!'
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
      message: 'User not logged in!'
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
          report: `Problem occured - ${newReport}!`,
          involvedId: '',
          message: 'Re-authentication is unsuccessful!'
        }
        reject(errorMesasge)
      });
    })
    .catch(err=>{
      reject(err);
    });
  });
}

module.exports.sessionCookieRenew = manageCookieRenew = (req, res, next)=>{
  if(req.cookies[sessionCookieName]){
    const cookieAttrib = sessionCookieAttributes();
    res.cookie(sessionCookieName,
      req.cookies[sessionCookieName],
      {
        path: cookieAttrib.path,
        expires: cookieAttrib.expireDate,
        httpOnly: cookieAttrib.httpOnly
      }
    );
  }
  next();
}
