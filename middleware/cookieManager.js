const verifyCookie = require('../middleware/dataValidation/cookieDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const cookieAttributes = require('../config/appConfig.js').cookieDetails;

verifyStructureContentCookie = (cookieContent)=>{
  return new Promise((resolve, reject)=>{
    verifyCookie(cookieContent)
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

function getClientProperDatetime(clientOffset){
  const serverDatetime = new Date();
  const serverTimezoneOffset = serverDatetime.getTimezoneOffset() * 60000;
  //(x * 60s*1000ms) (x min|x 660 >= x >= -660)
  // (x|x is the difference to get GMT in min)
  const serverUTC = serverDatetime + serverTimezoneOffset; //Coordinated Universal Time

  return (serverUTC + (clientOffset * 60000));
  //utc + (x * 60s*1000ms) (x min|x 660 >= x >= -660)
  //(x|x is the clientOffset, client difference to GMT in min)
}

defineSessionCookieAttributes = async (clientOffset)=>{

  const finalCookieExpiresTime =
    await getClientProperDatetime(clientOffset) + cookieAttributes.cookieLifetime;
  return {
    name: cookieAttributes.sessionCookieNameing,
    path: cookieAttributes.path,
    expireDate: new Date(finalCookieExpiresTime).toLocaleString(),
    httpOnly: cookieAttributes.cookieRestriction
  }
}


module.exports.cookieVerify = verifyStructureContentCookie;
module.exports.sessionCookie = defineCookieAttributes;
