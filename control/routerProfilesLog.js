const router = require('express').Router();

const apiResponseHeaders = require('../middleware/setAPIRespHeaders.js');
const logDataContentRev = require('../middleware/loginManagers.js').loginDatasRevision;
const profileExistRev = require('../middleware/loginManagers.js').loginProfileRevision;
const logPwdRev = require('../middleware/loginManagers.js').loginPasswordRevision;

const createSessionCookie = require('../utils/sessionCookieAttribs.js');

// API response common response configuration //
router.all('/', apiResponseHeaders)

// LOGIN //
router.post('/login', logDataContentRev)
router.post('/login', profileExistRev)
router.post('/login', logPwdRev)
//setting session cookie
router.post('/login', async (req, res)=>{
  const cookieAttrib = await createSessionCookie();
  res.cookie(cookieAttrib.name,
    req.loginUserId.toString(), //has been set by the middleware
    {
      path: cookieAttrib.path,
      expires: cookieAttrib.expireDate,
      httpOnly: cookieAttrib.httpOnly
    }
  );
  res.status(200);
  res.send({
    report: 'Access granted!',
    involvedId: '',
    message: 'You are logged in!'
  });
})


// LOGOUT //
// destroying session cookie
router.get('/logout', async(req,res)=>{
  const cookieAttrib = await createSessionCookie();
  res.cookie(cookieAttrib.name, req.loginUserId,
    {
      path: cookieAttrib.path,
      expire: 0,
      httpOnly: cookieAttrib.httpOnly
    }
  );
  res.status(200);
  res.send({
    report: 'Access terminated!',
    involvedId: '',
    message: 'You logged out!'
  });
})

module.exports = router;
