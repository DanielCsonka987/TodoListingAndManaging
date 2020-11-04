const router = require('express').Router();

const modelProfile = require('../model/profileProcesses.js');
const verifyProfile = require('../middleware/dataValidation/profileDatasValidity.js').validation;

// READ all user //
router.get('/', (req,res)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(405);    //METHOD NOT ALLOWED
    res.send(JSON.stringify(err));
  });
})




// REGISETER a new user //
//registration input-content revision
router.post('/register', (req, res, next)=>{
  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{
    res.status(400);    //BAD REQUEST
    res.send(JSON.stringify(err));
   });
})
//registration username uniquity revision
router.post('/register', (req, res, next)=>{
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result =>{
    if(result.report.length === 0){
      next();
    } else {
      res.status(405);    //METHOD NOT ALLOWED
      res.send(JSON.stringify({
        report: 'Username occupied!',
        involvedId: req.body,
        message: 'This username is already in use!',
      }));
    }
  })
  .catch(err=>{
    res.setStatsu(500);    //INTERNALE SERVER ERROR
  });
})
//execute regisration
router.post('/register', (req, res)=>{
  const newProf = {
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    occupation: req.body.occupation
  }
  modelProfile.createProfile(newProf)
  .then(result=>{
    res.status(202);    //ACCEPTED
    res.json(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(500);    //INTERNAL SERVER ERROR
    res.send(JSON.stringify(err));
  });
})

module.exports = router;
