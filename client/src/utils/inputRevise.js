const usernameTest = new RegExp('^[a-zA-Z0-9_.]{4,80}$');
const { clientException } = require('./errorObject')

// for RegisterForm //
module.exports.regInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    let errors = []
    if(reviseUnameMissmatch(datas.username)){
      errors.push({ 
        field: 'username', 
        msg: `Username is not acceptable!${datas.username}`
      });
    }
    if(revisePwdOutRange(datas.password)){
      errors.push({ 
        field: 'password', 
        msg: 'Password is not acceptable!'
      });
    }
    if(revisePwdsMissmatch(datas.password, datas.password_repeat)){
      errors.push({ 
        field: 'password_repeat', 
        msg: `Password confirmation is not matching!`
      });
    }
    if(datas.first_name.length === 0){
      errors.push({ 
        field: 'first_name', 
        msg: 'Firstname is not acceptable!'
      });
    }
    if(reviseAgeMissmatch(datas.age)){
      errors.push({ 
        field: 'age', 
        msg: `${datas.age} as age is not proper!`
      });
    }
    if(errors.length === 0){
      resolve();
    }
    reject(clientException(errors))
  })
}


// for ProfileItem //
module.exports.loginInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(revisePwdOutRange(datas.password)){
      reject( clientException('Password is not acceptable!')  )
    }
    resolve();
  })
}
module.exports.pwdChangeInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    let errors = [];
    if(revisePwdOutRange(datas.old_password)){
      errors.push({ 
        field: 'old_password', 
        msg: 'Previous password is not acceptable!'
      })
    }
    if(revisePwdOutRange(datas.new_password)){
      errors.push({ 
        field: 'new_password', 
        msg: 'New password is not acceptable!'
      })
    }
    if(revisePwdsMissmatch(datas.new_password, datas.password_repeat)){
      errors.push({ 
        field:'password_repeat', 
        msg: 'New passwords are not matching!'
      });
    }
    if(errors.length === 0){
      resolve()
    }
    reject( clientException(errors) )
  })
}
module.exports.deleteProfInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(revisePwdOutRange(datas.old_password)){
      reject( clientException('Password is not acceptable!') )
    }
    resolve();
  })

}

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
    return (age > 6)? false : true;
  }
  return false;
}


// for TodoItem //

module.exports.todoInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{

    if(datas.task === ''){
      reject('A task title required!');
    }
    if(datas.task.length > 150){
      reject('Too long task text!');
    }
    if(datas.prioirty === '' || 
      (datas.priority < 1 && datas.priority > 10) ){
      reject('A priority is needed in range from 1 to 10!')
    }
    if(datas.notation !== '' &&
      datas.notation.length > 150){
      reject('Too long notation text!');
    }
    resolve();
  })
}
module.exports.todoNotationInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(datas.notation.length > 150){
      reject('Too long notation text!');
    }
    resolve();
  })
}



