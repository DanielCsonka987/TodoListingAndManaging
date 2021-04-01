const router = require('express').Router();

const cookieMiddle = require('../middleware/cookieMiddlewares.js');
const profMiddle = require('../middleware/profileMiddlewares.js');

const paths = require('../config/appConfig').routing

// SESSION COOKIE AUTHENTICATION Middlewares //
router.all('/:id', cookieMiddle.cookieRevisionSteps)
router.all('/:id/*', cookieMiddle.cookieRevisionSteps)

// COMMON processes that needs user authentication //

// UPDATE user pwd //
router.put('/:id', profMiddle.pwdChangeSteps)

//Possibly should be age/occupation update as well

// DELETE the user account //
router.delete('/:id', profMiddle.removeAccountSteps);

module.exports = router;
