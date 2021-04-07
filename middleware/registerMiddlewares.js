const verifyProfile = require('../utils/validation/registerDatasValidity.js');
const pwdEncoder = require('../utils/passwordManagers.js').encodeThisPassword;
const createSessCookie = require('../utils/cookieManagers').createSessionCookieAtResObj
const model = require('../model/ProfileModel.js');
const regView = require('../view/middleView').forRegister

module.exports.registerSteps = [
  regDatasVerification, regProfilesCollisionScreen, 
  reqProfilePwdEncoding, createNewProfileAndLogin
]

function regDatasVerification(req, res, next){
  if(req.body.last_name === ''){
    delete req.body['last_name'];
  }
  if(req.body.age === '0'){
    delete req.body['age'];
  }
  if(req.body.occupaton === ''){
    delete req.body['occupation'];
  }

  verifyProfile(req.body)
  .then(result=>{ next()  })
  .catch(err=>{
    res.status(200);
    res.json( regView.registerDataFail(err) );
   });
}

function regProfilesCollisionScreen(req, res, next){
  model.findThisByUsername(req.body.username, result =>{
    if(result.status === 'failed'){
      next();
    }else{
      res.status(200); 
      res.json(regView.usernameOccupied);
    }
  })
}
function reqProfilePwdEncoding(req, res, next){
  pwdEncoder(req.body.password)
  .then(hashResult =>{
    req.body.hashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);
    res.json( regView.registeringError('password_encoding') );
  })
}


function createNewProfileAndLogin(req, res){
  const newProf = {
    username: req.body.username,
    password: req.body.hashedPassword,   //created by this middleware
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    occupation: req.body.occupation
  }
  //console.log(newProf)
  model.createNewProfile(newProf, result=>{
    if(result.status === 'success'){
      createSessCookie(res, result.report.id);
      delete result.report.id
      res.status(200)
      res.json( regView.registerSuccess(result) )
    }else{
      res.status(500);
      res.json( regView.regProfilePersistFail(result) );
    }
  })
}