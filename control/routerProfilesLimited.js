const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const cookieMiddle = require('../middleware/cookieManagers.js');
const profMiddle = require('../middleware/profileMiddlewares.js');
const modelProfile = require('../model/profileProcesses.js');

// API response common response configuration //
router.all('/:id', apiResponseHeaders)

// SESSION COOKIE AUTHENTICATION //
router.all('/:id', cookieMiddle.existVerification);
router.all('/:id', cookieMiddle.contentVerification);

// SESSION COOKIE RENEWING //
router.all('/:id', cookieMiddle.sessionCookieRenew);

// COMMON processes that needs user authentication //

// READ strict user details //
// USER fetching its details
router.get('/:id', (req, res)=>{
  modelProfile.findThisProfileById(req.params.id)
  .then(result =>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to show!',
      involvedId: 'id',
      message: 'Such user not have found!'
    })
  });
})


// UPDATE user pwd //
router.put('/:id', profMiddle.profileUpdateContentVerification);
router.put('/:id', profMiddle.profileAccountExistVerification);
router.put('/:id', profMiddle.profileOldPwdConfirmation);
router.put('/:id', profMiddle.profileNewPwdEncoding);
router.put('/:id', (req, res)=>{
  modelProfile.updateProfilePassword(req.params.id, req.newHashedPassword)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to update!',
      involvedId: 'id',
      message: 'Such user not have found!'
    })
  });
})


//Possibly should be age/occupation update as well



// DELETE the user account //
router.delete('/:id', profMiddle.profileAccountExistVerification)
router.delete('/:id', profMiddle.profileOldPwdConfirmation);
router.delete('/:id', (req, res)=>{
  modelProfile.deleteProfile(req.params.id)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to delete!',
      involvedId: 'id',
      message: 'Such user not have found!'
    })
  });
});

module.exports = router;
