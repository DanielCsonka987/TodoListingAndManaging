const sessionCookieAttributes = require('../utils/sessionCookieAttribs.js');
const cookieAttributesConfig = require('../config/appConfig.js').cookie;

// GENERAL METHODS //
module.exports.createSessionCookieAtResObj(res, value){
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
module.exports.removeSessionCookieAtResObj = (res, value)=>{
    const cookieAttrib = sessionCookieAttributes();
    res.cookie(cookieAttrib.name, value,
      {
        path: cookieAttrib.path,
        expires: 0,
        httpOnly: cookieAttrib.httpOnly,
        secure: cookieAttrib.secure,
        sameSite: cookieAttrib.sameSite
    });
}
  
  const sessionCookieAttributes = ()=>{
    const properExpires_ms = new Date().getTime()
        + cookieAttributesConfig.cookieLifetime;
    return {
        name: cookieAttributesConfig.sessionCookieNameing,
        path: cookieAttributesConfig.path,
        expireDate: new Date(properExpires_ms),
        httpOnly: cookieAttributesConfig.cookieHTTPOnly,
        session: cookieAttributesConfig.cookieSecure,
        sameSite: cookieAttributesConfig.cookieSameSite
    }
  }