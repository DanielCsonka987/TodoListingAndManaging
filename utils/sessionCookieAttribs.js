const cookieAttributesConfig = require('../config/appConfig.js')
  .cookie_details;

module.exports = ()=>{
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
