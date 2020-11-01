const verifyCookie = require('../middleware/dataValidation/cookieDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const cookieLifetime = require('../config/appConfig.js').cookieLifetime;


verifyStructureContentCookie = (cookieNameContent)=>{
  return new Promise((resolve, reject)=>{
    verifyCookie(req.cookies.name)
    .then(result=>{
      modelProfile.findThisProfileById(req.cookies.name)
      .then(res=>{ resolve() })
      .catch((err)=>{
        let newReport = '';
        if(err.report === 'MongoDB error!')
          newReport = 'Connection issue';
        else
          newReport = 'Unkonwn identifier';
        let errorMesasge = {
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

createCookie = (profileId)=>{
  return ['name', profileId, { maxAge: cookieLifetime, httpOnly: true } ]
}

deleteCookie = ()=>{
  return ['name', '', { maxAge: 0, httpOnly: true}];
}

module.exports.cookieVerify = verifyStructureContentCookie;
module.exports.cookieSetting = createCookie;
module.exports.cookieRemove = deleteCookie;
