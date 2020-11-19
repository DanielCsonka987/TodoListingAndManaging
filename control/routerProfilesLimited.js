const router = require('express').Router();

const cookieMiddle = require('../middleware/cookieManagers.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

// SESSION COOKIE AUTHENTICATION //
router.all('/:id/*', cookieMiddle.existVerification);
router.all('/:id/*', cookieMiddle.contentVerification);
router.all('/:id/*', cookieMiddle.contentDBRevision); //Prof existence authent

// COMMON processes that needs user authentication //

// READ strict user details //
// USER fetching its details
router.get('/:id', profMiddle.readThisProfiles)
router.get('/:id', (req, res)=>{ res.send()})

// UPDATE user pwd //
router.put('/:id', profMiddle.profileUpdateContentVerification);
router.put('/:id', profMiddle.profileOldPwdConfirmation);
router.put('/:id', profMiddle.profileNewPwdEncoding);
router.put('/:id', profMiddle.profilePwdUpdate);
router.put('/:id', (req, res)=>{
  res.send();
})

//Possibly should be age/occupation update as well



// DELETE the user account //
router.delete('/:id', profMiddle.profileOldPwdConfirmation);
router.delete('/:id', profMiddle.profileDeletion);
router.delete('/:id', cookieMiddle.sessionCookieDeletionRemoval)
router.delete('/:id', (req, res)=>{
  res.send();
});

module.exports = router;
