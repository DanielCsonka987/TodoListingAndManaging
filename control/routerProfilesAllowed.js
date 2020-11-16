const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const cookieMiddle = require('../middleware/cookieManagers.js');
const loginMiddle = require('../middleware/loginManagers.js');
const modelProfile = require('../model/profileProcesses.js');

// API response common response configuration //
router.all('/', apiResponseHeaders)
router.all('/:id/login', apiResponseHeaders)

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
    res.status(500);    //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  });
})

// LOGIN //
router.post('/:id/login', loginMiddle.loginDatasRevision)
router.post('/:id/login', loginMiddle.loginProfileExistenceRevision)
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
// destroying session cookie
router.get('/:id/logout', cookieMiddle.sessionCookieRemoval)
router.get('/:id/logout', async(req,res)=>{
  res.status(200);
  res.send({
    report: 'Access terminated!',
    message: doneMessages.logout
  });
})

module.exports = router;
