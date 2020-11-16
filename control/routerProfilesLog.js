const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const createSessionCookie = require('../utils/sessionCookieAttribs.js');
const registrateMiddle = require('../middleware/registerManagers.js');
const cookieManager = require('../middleware/cookieManagers.js')
const modelProfile = require('../model/profileProcesses.js');

const doneMessages = require('../config/appConfig.js').front_success_messages;
// API response common response configuration //
router.all('/register', apiResponseHeaders)

// REGISETER a new user //
router.post('/register',registrateMiddle.regDatasVerification);
router.post('/register', registrateMiddle.regProfilesCollisionScreen);
router.post('/register', registrateMiddle.reqProfilePwdEncoding);
router.post('/register', (req, res, next)=>{
  const newProf = {
    username: req.body.username,
    password: req.body.hashedPassword,   //created by the middleware
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    occupation: req.body.occupation
  }
  modelProfile.createProfile(newProf)
  .then(result=>{
    console.log(result);
    cookieManager.sessionCookieRegisterCreation(res, result.report.id);
    res.status(201);    //CREATED
    res.send(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);    //INTERNAL SERVER ERROR
    res.send(JSON.stringify(err));
  });
})


module.exports = router;
