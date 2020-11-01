const router = require('express').Router();

const modelProfile = require('../model/profileProcesses.js');
const verifyProfile = require('../middleware/dataValidation/profileDatasValidity.js');

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
    res.status(202);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    next(err);
  });
})


module.exports = router;
