const usernameTest = new RegExp('^[a-zA-Z0-9_.]{4,80}$');
const { clientException, clientError } = require('./errorObject')

// REVISION helpers
function reviseUnameMissmatch(unm){
  return !usernameTest.test(unm);
}
function revisePwdOutRange(pwd){
  return pwd.length < 4 || pwd.length > 40;
}
function revisePwdsMissmatch(pwd1, pwd2){
  return pwd1.normalize() !==  pwd2.normalize();
}
function reviseAgeMissmatch(age){
  if(age !== ''){
    return (age > 5)? false : true;
  }
  return false;
}


// for RegisterForm //
module.exports.regInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    try{
      let errors = []
      if(reviseUnameMissmatch(datas.username)){
        errors.push({ 
          field: 'username', 
          message: `Username is not acceptable! ${datas.username}`
        });
      }
      if(revisePwdOutRange(datas.password)){
        errors.push({ 
          field: 'password', 
          message: 'Password is not acceptable!'
        });
      }
      if(revisePwdsMissmatch(datas.password, datas.password_repeat)){
        errors.push({ 
          field: 'password_repeat', 
          message: `Password confirmation is not matching!`
        });
      }
      if(datas.first_name.length === 0){
        errors.push({ 
          field: 'first_name', 
          message: 'Firstname is not acceptable!'
        });
      }
      if(reviseAgeMissmatch(datas.age)){
        errors.push({ 
          field: 'age', 
          message: `${datas.age} as age is not proper!`
        });
      }
      if(errors.length === 0){
        resolve();
      }
      reject( clientException(errors) )
    }catch(e){
      reject( clientError(e) )
    }
  })
}


// for ProfileItem //
module.exports.loginInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    try{
      let errors = []
      if(reviseUnameMissmatch(datas.username)){
        errors.push({ 
          field: 'username', 
          message: `Username is not acceptable! ${datas.username}`
        });
      }
      if(revisePwdOutRange(datas.password)){
        errors.push({ 
          field: 'password', 
          message: 'Password is not acceptable!'
        });
      }
      if(errors.length === 0){
        resolve();
      }
      reject( clientException(errors)  )
    }catch(e){
      reject( clientError(e) )
    }
  })
}
module.exports.pwdChangeInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    try{
      let errors = [];
      if(revisePwdOutRange(datas.old_password)){
        errors.push({ 
          field: 'old_password', 
          message: 'Previous password is not acceptable!'
        })
      }
      if(revisePwdOutRange(datas.new_password)){
        errors.push({ 
          field: 'new_password', 
          message: 'New password is not acceptable!'
        })
      }
      if(revisePwdsMissmatch(datas.new_password, datas.password_repeat)){
        errors.push({ 
          field:'password_repeat', 
          message: 'New passwords are not matching!'
        });
      }
      if(errors.length === 0){
        resolve()
      }
      reject( clientException(errors) )
    }catch(e){
      reject( clientError(e) )
    }
  })
}
module.exports.deleteProfInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    try{
      if(revisePwdOutRange(datas.old_password)){
        reject( clientException('Password is not acceptable!') )
      }
      resolve();
    }catch(e){
      reject( clientError(e) )
    }
  })

}


// for TodoItem //
function reviseNotationOutOfRange(note){
  if(typeof note === null){ return true }
  return note !== '' && note.length > 150
}

module.exports.todoInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    try{
      let errors = [];
      if(datas.task === ''){
        errors.push({
          field: 'task',
          message:'A task title required!'});
      }
      if(datas.task.length > 150){
        errors.push({ 
          field: 'task', 
          message: 'Too long task text!'});
      }
      if(datas.priority < 1 || datas.priority > 10 ){
        errors.push({
          field: 'priority', 
          message:'A priority is needed in range from 1 to 10!'})
      }
      if(reviseNotationOutOfRange(datas.notation)){
        errors.push({
          field: 'notation', 
          message:'Too long notation text!'});
      }
  
      if(errors.length === 0){
        resolve();
      }
      reject( clientException(errors) )
    }catch(e){
      reject( clientError(e) )
    }
  })
}
module.exports.todoNotationInputRevise = (newNotation)=>{
  return new Promise((resolve, reject)=>{
    try{
      let errors = []
      if(reviseNotationOutOfRange(newNotation)){
        errors.push({ 
          field: 'notation', 
          message: 'Too long notation text!'});
      }
      if(errors.length === 0){
        resolve();
      }
      reject( clientException(errors) )
    }catch(e){
      reject( clientError(e) )
    }
  })
}



