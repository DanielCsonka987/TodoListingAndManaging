const router = require('express').Router();
const bcrypt = require('bcrypt');

const bryptRound = require('../config/appConfig.js').encryption_saltrounds;
const modelProfile = require('../model/profileProcesses.js');
const verifyProfile = require('../middleware/dataValidation/profileDatasValidity.js');
const verifyLogin = require('../middleware/dataValidation/loginDatasValidity.js');
const createCookie = require('../middleware/cookieManager.js').cookieSetting;
const deleteCookie = require('../middleware/cookieManager.js').cookieRemove;

// READ all user //
router.get('/', (req,res)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    next(err);
  });
})




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




// REGISETER a new user //
//registration input-content revision
router.post('/register', (req, res, next)=>{
  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{
    err.defStatus = 400;  //BAD REQUEST
    next(err);
   });
})
//registration username uniquity revision
router.post('/register', (req, res, next)=>{
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result =>{
    if(result.report.length === 0){
      next();
    } else {
      next({
        report: 'Username occupied!',
        involvedId: req.body,
        message: 'This username is already in use!',
        defStatus: 400
      })
    }
  })
  .catch(err=>{ next(err) });
})
//execute regisration
router.post('/register', (req, res)=>{
  modelProfile.createProfile(result)
  .then(result=>{
    res.cookie(createCookie(result.report._id));
    res.status(202);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    next(err);
  });
})


module.exports = router;
