const verifyProfile = require('../utils/dataValidation/profileDatasValidity.js').validation);
const modelProfile = require('../model/profileProcesses.js');
const pwdEncoder = require('../utils/passwordManagers.js').encodeThisPassword;

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
    res.status(405);    //METHOD NOT ALLOWED
    res.send(JSON.stringify({
      report: 'Username occupied!',
      involvedId: req.body,
      message: 'This username is already in use!',
    }));
  })
  .catch(err=>{
    next();
  });
}

module.exports.reqProfilePwdEncoding = (req, res, next)=>{
  pwdEncoder(req.body.password)
  .then(hashResult =>{
    req.body.hashedPassword = hashResult;
  })
  .catch(err=>{
    res.status(500);    //METHOD NOT ALLOWED
    res.send(JSON.stringify({
      report: 'Password encodin error!',
      involvedId: req.body.password,
      message: 'Server function error!',
    }));
  })
}
