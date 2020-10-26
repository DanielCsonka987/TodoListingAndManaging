const router = require('express').Router();
const crypt = require('bcrypt');
const bodyparser = require('body-parser');

const modelProfile = require('../model/profileProcesses.js');
const verifyProfile = require('../middleware/dataValidation/profileDatasValidity.js');

router.use(bodyparser.urlencoded({extended: true}));

//API response common configuration//
router.all('/', (req, res, next)=>{
  res.setHeader('Content-Type', 'application/json' );
  next();
})

//READ all user//
router.get('/', (req,res)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    next(err);
  });
})

//REGISETER a new user//
//registration content revision
router.post('/:id', (req, res, next)=>{
  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{  next(err)  });
})
//execute regisration
router.post('/:id', (req, res)=>{
  modelProfile.createProfile(result)
  .then(result=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{  next(err);  });
})

//COMMON processes with  //
//
router.all('/', (req, res, next)=>{

})

//READ strict user details//
router.get('/:id', (req, res)=>{

})

//UPDATE user pwd
router.put('/:id', (req, res)=>{

})

router.delete('/:id', (req, res)=>{

});


//ERROR handling locally
router.use('/', (err, req, res, next)=>{
  console.log(err);
  res.status(404);
  res.send(JSON.stringify( { err } );
})

module.exports = router;
