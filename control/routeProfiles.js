const router = require('express').Router();
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');

const bryptRound = require('../config/appConfig.js').encryption_saltrounds;
const modelProfile = require('../model/profileProcesses.js');
const verifyProfile = require('../middleware/dataValidation/profileDatasValidity.js');


router.use(bodyparser.urlencoded({extended: true}));


// API response common configuration //
router.all('/', (req, res, next)=>{
  res.setHeader('Content-Type', 'application/json' );
  next();
})


// READ all user //
router.get('/', (req,res)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 403;
    next(err);
  });
})


// LOGIN //
//revise if there are username and pwd
router.post('/', (req, res, next)=>{

})
//authentication with pwd
router.post('/', (req,res,next)=>{
  bcrypt.compare()

})
//setting cookie
router.post('/', (req, res)=>{

})

// REGISETER a new user //
//registration input-content revision
router.post('/register', (req, res, next)=>{
  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{
    err.defStatus = 403;
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
        defStatus: 403
      })
    }
  })
  .catch(err=>{ next(err) });
})
//execute regisration
router.post('/register', (req, res)=>{
  modelProfile.createProfile(result)
  .then(result=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    err.defStatus = 404;
    next(err);
  });
})


// COMMON processes that need user authentication //
//revision if user manages its own profile
router.all('/:id', (req, res, next)=>{
  if(req.body.id === req.params.id){
    next();
  } else {
    next({
      report: 'User interfering in another account!',
      involvedId: req.params.id,
      message: 'Management is permitted only at your account!',
      defStatus: 403
    });
  }
})
//authentication with cookie
router.all('/:id', (req, res, next)=>{

}

// READ strict user details //
//
router.get('/:id', (req, res, next)=>{

})
router.get('/:id', (req, res)=>{

})


// UPDATE user pwd //
router.put('/:id', (req, res)=>{

})

// DELETE the user account //
router.delete('/:id', (req, res)=>{

});


// ERROR handling locally //
router.all('/', (err, req, res, next)=>{
  console.log(err);
  res.status(err.defStatus);
  res.send(JSON.stringify( { err } );
})

module.exports = router;
