const cookieAttributesConfig = require('../config/appConfig.js').cookie;

// GENERAL METHODS //
module.exports.createSessionCookieAtResObj = (res, value)=>{
  try{
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
    //console.log(cookieAttrib.expireDate)
  }catch(e){
    console.log('Error ', e)
  }
}
module.exports.removeSessionCookieAtResObj = (res)=>{
  try{
    const cookieAttrib = sessionCookieAttributes();
    res.cookie(cookieAttrib.name, '',
      {
        path: cookieAttrib.path,
        expires: 0,
        httpOnly: cookieAttrib.httpOnly,
        secure: cookieAttrib.secure,
        sameSite: cookieAttrib.sameSite
    });
  }catch(e){
    console.log('Error ', e)
  }
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