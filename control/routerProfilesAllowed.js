const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const cookieMiddle = require('../middleware/cookieManagers.js');
const loginMiddle = require('../middleware/loginManagers.js');
const profMiddle = require('../middleware/profileMiddlewares.js');
const registrateMiddle = require('../middleware/registerManagers.js');
const modelProfile = require('../model/profileProcesses.js');

const doneMessages = require('../config/appMessages.js').front_success_messages;

// COMMON API response common response configuration //
router.all('/*', apiResponseHeaders)

// SESSION COOKIE RENEWING //
router.all('/*', cookieMiddle.sessionCookieRenew);

// READ all user //
router.get('/', profMiddle.readAllProfiles);
router.get('/', (req,res)=>{
  res.send();
})

// REGISETER a new user //
// with creating session cookie
router.post('/register',registrateMiddle.regDatasVerification);
router.post('/register', registrateMiddle.regProfilesCollisionScreen);
router.post('/register', registrateMiddle.reqProfilePwdEncoding);
router.post('/register', profMiddle.createNewProfile);
router.post('/register', cookieMiddle.sessionCookieRegisterCreation);
router.post('/register', (req, res)=>{
  res.send();
})


// LOGIN //
router.post('/:id/login', loginMiddle.loginDatasRevision)
router.post('/:id/login', loginMiddle.loginProfileExistenceRevision)
router.post('/:id/login', loginMiddle.pathQueryRevisionWithExistingProf)
router.post('/:id/login', loginMiddle.loginPasswordRevision)
router.post('/:id/login', cookieMiddle.sessionCookieLoginCreation)
router.post('/:id/login', (req, res)=>{
  res.status(200);
  res.send({
    report: 'Access granted!',
    message: doneMessages.login
  });
})

// LOGOUT //
// with destroying session cookie
router.get('/:id/logout', cookieMiddle.sessionCookieRemoval)
router.get('/:id/logout', (req,res)=>{
  res.status(200);
  res.send({
    report: 'Access terminated!',
    message: doneMessages.logout
  });
})

module.exports = router;
