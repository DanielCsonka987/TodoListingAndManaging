const router = require('express').Router();

const cookieMiddle = require('../middleware/cookieMiddlewares.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

const paths = require('../config/appConfig').routing

// SESSION COOKIE AUTHENTICATION //
router.all('/:id', 
  cookieMiddle.existVerification,
  cookieMiddle.contentVerification,
  cookieMiddle.contentDBRevision); //Prof existence authent, hashPwd stored!
  
router.all('/:id/*', 
  cookieMiddle.existVerification,
  cookieMiddle.contentVerification,
  cookieMiddle.contentDBRevision); //Prof existence authent, hashPwd stored!


// COMMON processes that needs user authentication //

// READ strict user details //
// USER fetching its details
router.get('/:id', 
  profMiddle.readThisProfiles, 
  (req, res)=>{ 
    res.send()
})

// UPDATE user pwd //
router.put('/:id', 
  profMiddle.profileUpdateContentVerification,
  profMiddle.profileOldPwdConfirmation, 
  profMiddle.profileNewPwdEncoding, 
  profMiddle.profilePwdUpdate,
  (req, res)=>{
  res.send();
})

//Possibly should be age/occupation update as well



// DELETE the user account //
router.delete('/:id', 
  profMiddle.profileOldPwdConfirmation,
  profMiddle.profileDeletion, 
  cookieMiddle.sessionCookieDeletionRemoval,
    (req, res)=>{
  res.send();
});

module.exports = router;
