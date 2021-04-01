const router = require('express').Router();

const apiResponseHeaders = require('../middleware/apiHeadersMiddlewares.js');
const cookieMiddle = require('../middleware/cookieMiddlewares.js');
const loginMiddle = require('../middleware/loginMiddlewares.js');
const logoutMiddle = require('../middleware/logoutMiddlewares.js');
const profileMiddle = require('../middleware/profileMiddlewares')
const registrateMiddle = require('../middleware/registerMiddlewares.js');

const paths = require('../config/appConfig').routing

// COMMON API response common response configuration //
router.all('/*', apiResponseHeaders)


// READ all user //
router.get('/', profileMiddle.readPublicPrfilesSteps)


// LOGGED IN STATE REVISON //
router.get(paths.logRevisPostfix, cookieMiddle.reviseLoggedInState)


// REGISETER a new user //
// with creating session cookie
router.post(paths.registerPostfix, registrateMiddle.registerSteps)


// LOGIN //
router.post('/:id'+ paths.loginPostfix, loginMiddle.loginSteps)

// LOGOUT //
// with destroying session cookie
router.get('/:id'+paths.logoutPostfix, logoutMiddle.logoutSteps)

module.exports = router;
