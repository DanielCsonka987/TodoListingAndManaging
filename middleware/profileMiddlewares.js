const pwdChangeDataValidity = require('../utils/dataValidation/pwdChangeDatasValidity.js');
const modelProfile = require('../model/profileProcesses.js');
const modelTodo = require('../model/todoProcesses.js')

const pwdManager = require('../utils/passwordManagers.js');
const errorMessages = require('../config/appMessages.js').front_error_messages;

module.exports.profileUpdateContentVerification = (req, res, next)=>{
  pwdChangeDataValidity(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400);  //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}

/*
module.exports.profileAccountExistVerificationAndHashPwdGetting = (req, res, next)=>{
  modelProfile.findThisProfileById_detailed(req.params.id)
  .then(result =>{
    req.oldHashedPwd = result.report.password;
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  })
}
*/

//it is needed at password update, todo deletions
module.exports.profileOldPwdConfirmation = (req, res, next)=>{
  console.log(req.oldHashedPwd)
  pwdManager.verifyThisPassword(req.body.old_password, req.oldHashedPwd)
  .then(()=>{
    next();
  })
  .catch(err=>{
    if(err === 'incorrect'){
      res.status(400);  //BAD REQUEST
      res.send(JSON.stringify({
        report: 'Old password is wrong!',
        involvedId: {field: 'old_password', input: req.body.old_password},
        message: errorMessages.password_update_revise
      }))
    } else {
      res.status(500);  //SERVER INTERNAL ERROR
      res.send(JSON.stringify({
        report: 'Password inspection error!',
        involvedId: 'old_password',
        message: errorMessages.authentication_unknown
      }))
    }
  })
}

module.exports.profileNewPwdEncoding = (req, res, next)=>{
  pwdManager.encodeThisPassword(req.body.new_password)
  .then(hashResult=>{
    req.newHashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);  //SERVER INTERNAL ERROR
    res.send(JSON.stringify({
      report: 'New password encription error!',
      involvedId: {field: 'new_password', input: req.body.new_password},
      message: errorMessages.password_update_newHashing
    }));
  })
}




// TERMINAL PROCESSES //
module.exports.createNewProfile = (req, res, next)=>{
  const newProf = {
    username: req.body.username,
    password: req.body.hashedPassword,   //created by the middleware
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    occupation: req.body.occupation
  }
  //console.log(newProf)
  modelProfile.createProfile(newProf)
  .then(result=>{
    req.justCreatedUserMessage = result;
    next();
  })
  .catch(err=>{
    res.status(500);    //INTERNAL SERVER ERROR
    res.send(JSON.stringify(err));
  });
}


module.exports.readAllProfiles = (req, res, next)=>{
  modelProfile.loadInProfiles()
  .then((result)=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(500);    //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  });
}
module.exports.readThisProfiles = (req, res, next)=>{
  modelProfile.findThisProfileById(req.params.id)
  .then(result =>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err))
  });
}

module.exports.profilePwdUpdate = (req, res, next)=>{
  modelProfile.updateProfilePassword(req.params.id, req.newHashedPassword)
  .then(result=>{
    res.status(200);
    res.write(JSON.stringify(result));
    next();
  })
  .catch(err=>{
    res.status(404);
    res.send(JSON.stringify(err))
  });
}

module.exports.profileDeletion = (req, res, next) =>{
  modelTodo.deleteAllTodos(req.params.id)
  .then(resultTodo =>{

    modelProfile.deleteProfile(req.params.id)
    .then(resultProfile=>{
      resultProfile.report.deletedTodo =  resultTodo.report.deletedTodo;
      req.justRemovedUserMessage = resultProfile;
      next();
    })
    .catch(err=>{
      res.status(404);
      res.send(JSON.stringify(err))
    });

  })
  .catch(err=>{
    res.status(500); //SERVER INTERNAL ERROR
    res.send(JSON.stringify(err));
  })

}
