const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const cookieMiddle = require('../middleware/cookieManagers.js');
const modelProfile = require('../model/profileProcesses.js');
const registrateMiddle = require('../middleware/registerManagers.js');

// API response common response configuration //
router.all('/', apiResponseHeaders)

// SESSION COOKIE RENEWING //
router.all('/', cookieMiddle.sessionCookieRenew);

// READ all user //
router.get('/', (req,res)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(405);    //METHOD NOT ALLOWED
    res.send(JSON.stringify(err));
  });
})




// REGISETER a new user //
//registration input-content revision
router.post('/register',registrateMiddle.regDatasVerification);
//registration username uniquity revision
router.post('/register', registrateMiddle.regProfilesCollisionScreen);
//registration password encoding
router.post('/register', registrateMiddle.reqProfilePwdEncoding);
//execute regisration
router.post('/register', (req, res)=>{
  const newProf = {
    username: req.body.username,
    password: req.body.hashedPassword,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    occupation: req.body.occupation
  }
  modelProfile.createProfile(newProf)
  .then(result=>{
    res.status(201);    //CREATED
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(500);    //INTERNAL SERVER ERROR
    res.send(JSON.stringify(err));
  });
})

module.exports = router;
