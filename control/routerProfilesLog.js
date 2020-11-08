const router = require('express').Router();
const bcrypt = require('bcrypt');

const modelProfile = require('../model/profileProcesses.js');
const verifyLogin = require('../middleware/dataValidation/loginDatasValidity.js');
const createSessionCookie = require('../middleware/cookieManager.js').sessionCookie;

// LOGIN //
//revise if there are username and pwd
router.post('/login', (req, res, next)=>{
  verifyLogin(req.body)
  .then(res=>{ next() })
  .catch(err=>{
    res.status(400);   //BAD REQUEST
    res.send(JSON.stringify(err));
  });
})
//find user from DB
router.post('/login', (req, res, next)=>{
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result=>{
    req.loginUserId = result.report._id;  //for the cookie content
    req.loginUserHashPwd = result.report.password;  //for authenticate
    next();
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err));
  });
})
//authentication with pwd
router.post('/login', (req,res,next)=>{
  bcrypt.compare(req.loginUserHashPwd, req.body.password)
    .then(verifResult=>{ next();  })
    .catch(err=>{
      res.status(500);
      res.send(JSON.stringify({
        report: 'Password inseption failed!',
        involvedId: 'password',
        message: 'Authentication error!'
      }))
    });
})
//setting cookie
router.post('/login', (req, res)=>{
  const cookieAttrib = createSessionCookie(req.headers['offset']);
  res.cookie(cookieAttrib.name, req.loginUserId,
    {
      path: cookieAttrib.path,
      expire: 0,
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
router.get('/logout', (req,res)=>{
  const cookieAttrib = createSessionCookie(0);
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
