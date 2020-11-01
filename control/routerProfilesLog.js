const router = require('express').Router();
const bcrypt = require('bcrypt');

const bryptRound = require('../config/appConfig.js').encryption_saltrounds;
const modelProfile = require('../model/profileProcesses.js');
const verifyLogin = require('../middleware/dataValidation/loginDatasValidity.js');
const createCookie = require('../middleware/cookieManager.js').cookieSetting;
const deleteCookie = require('../middleware/cookieManager.js').cookieRemove;

// LOGIN //
//revise if there are username and pwd
router.post('/login', (req, res, next)=>{
  verifyLogin(req.body)
  .then(res=>{ next() })
  .catch(err=>{
    err.defStatus(400);   //BAD REQUEST
    next(err);
  });
})
//find user from DB
router.post('/login', (req, res, next)=>{
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result=>{
    req.loginUserId = result.report._id;
    req.loginUserHashPwd = result.report.password;
    next();
  })
  .catch(err=>{
    err.defStatus = 404;
    next(err);
  });
})
//authentication with pwd
router.post('/login', (req,res,next)=>{
  bcrypt.compare(req.loginUserHashPwd, req.body.password, (err)=>{
    if(err) next(err);
    next();
  })

})
//setting cookie
router.post('/login', (req, res)=>{
  res.cookie(createCookie(req.loginUserId));
  res.status(200);
})





// LOGOUT //
router.get('/logout', (res,res)=>{
  res.cookie(deleteCookie());
  res.status(200);
})

module.exports = router;
