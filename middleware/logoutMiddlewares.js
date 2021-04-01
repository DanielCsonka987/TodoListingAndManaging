const cookieRemoval = require('../utils/cookieManagers').removeSessionCookieAtRespObj
const logoutView = require('../view/middleView').forLogout
module.exports.logoutSteps = [
  cookieLogoutRemoval
]

// SESSION Cookie removal, logout
function cookieLogoutRemoval(req, res){
  try{
    cookieRemoval(res, '');
    res.status(200)
    res.json( logoutView.success )
  }catch(e){
    res.status(500)
    res.json( logoutView.failed )
  }
 }
  