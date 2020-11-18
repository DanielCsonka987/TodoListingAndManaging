const verifyProfile = require('../utils/dataValidation/registerDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const pwdEncoder = require('../utils/passwordManagers.js').encodeThisPassword;

const errorMessages = require('../config/appMessages.js').front_error_messages;

module.exports.regDatasVerification = (req, res, next)=>{
  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{
    res.status(400);    //BAD REQUEST
    res.send(JSON.stringify(err));
   });
}

module.exports.regProfilesCollisionScreen = (req, res, next)=>{
  modelProfile.findThisProfileByUsername(req.body.username)
  .then(result =>{
    if(Object.keys(result.report).length === 0){   // NO RESULT
      next();
    }else{
      res.status(405);    //METHOD NOT ALLOWED
      res.send(JSON.stringify({
        report: 'Username occupied!',
        involvedId: { username: req.body.username },
        message: errorMessages.register_username_occupied
      }));
    }
  })
  .catch(err=>{
    res.status(500);    //METHOD NOT ALLOWED
    res.send(JSON.stringify({
      report: 'Error at username collision inseption!',
      involvedId: {field: 'username', input: req.body.username },
      message: errorMessages.password_regOrUpdate_newHashing
    }));
  });
}

module.exports.reqProfilePwdEncoding = (req, res, next)=>{
  pwdEncoder(req.body.password)
  .then(hashResult =>{
    req.body.hashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);    //METHOD NOT ALLOWED
    res.send(JSON.stringify({
      report: 'Password encoding error at registration!',
      involvedId: {field: 'password', input: req.body.password },
      message: errorMessages.password_regOrUpdate_newHashing
    }));
  })
}
