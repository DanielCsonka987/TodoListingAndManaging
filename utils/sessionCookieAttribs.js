const cookieAttributes = require('../config/appConfig.js').cookieDetails;

module.exports = ()=>{
  const properExpires_ms = new Date().getTime()
    + cookieAttributes.cookieLifetime;
  return {
    name: cookieAttributes.sessionCookieNameing,
    path: cookieAttributes.path,
    expireDate: new Date(properExpires_ms),
    httpOnly: cookieAttributes.cookieHTTPOnly
  }
}
