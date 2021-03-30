const router = require('express').Router();

const apiResponseHeaders = require('../middleware/apiHeadersMiddlewares.js');
const cookieMiddle = require('../middleware/cookieMiddlewares.js');
const loginMiddle = require('../middleware/loginMiddlewares.js');
const logoutMiddle = require('../middleware/logoutMiddlewares.js');
const registrateMiddle = require('../middleware/registerMiddlewares.js');

const paths = require('../config/appConfig').routing

// COMMON API response common response configuration //
router.all('/*', apiResponseHeaders)

// SESSION COOKIE RENEWING //
router.all('/*', cookieMiddle.sessionCookieRenew);

// READ all user //
router.get('/', 
  profMiddle.readAllProfiles, 
  (req,res)=>{
  res.send();
})


// LOGGED IN STATE REVISON //
router.get(paths.logRevisPostfix, 
  cookieMiddle.reviseLoggedInState,
  (req, res)=>{
    res.status(200);
    res.send();
})


// REGISETER a new user //
// with creating session cookie
router.post(paths.registerPostfix, 
  registrateMiddle.regDatasVerification, 
  registrateMiddle.regProfilesCollisionScreen,
  registrateMiddle.reqProfilePwdEncoding, 
  profMiddle.createNewProfile,
  cookieMiddle.sessionCookieRegisterCreation,
  (req, res)=>{
  res.send();
})


// LOGIN //
router.post('/:id'+ paths.loginPostfix, 
  loginMiddle.loginDatasRevision, 
  loginMiddle.loginProfileExistenceRevision,
  loginMiddle.pathQueryRevisionWithExistingProf, 
  loginMiddle.loginPasswordRevision,
  cookieMiddle.sessionCookieLoginCreation,
  (req, res)=>{
  modelProfile.findThisProfileById(req.params.id)
  .then(result=>{
    result.message = doneMessages.login;
    res.status(200).send(
      JSON.stringify(result)
    );
  })
  .catch(err=>{
    res.status(500).send(JSON.stringify(err));
  })
})

// LOGOUT //
// with destroying session cookie
router.get('/:id'+paths.logoutPostfix, 
  cookieMiddle.sessionCookieRemoval,
  (req,res)=>{
    res.status(200);
    res.send(JSON.stringify({
      report: 'Access terminated!',
      message: doneMessages.logout
  }));
})

module.exports = router;
