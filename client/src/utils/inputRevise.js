const usernameTest = new RegExp('^[a-zA-Z0-9_.]{4,80}$');

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
        msg: `Age is not proper!${datas.age}`
      });
    }
    if(errors.lengt === 0){
      resolve();
    }else{}
      reject(errors)
    }
  })
}
module.exports.loginInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(revisePwdOutRange(datas.password)){
      reject('Password is not acceptable!')
    }
    resolve();
  })
}
module.exports.pwdChangeInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(revisePwdOutRange(datas.old_password)){
      reject('Previous password is not acceptable!')
    }
    if(revisePwdsMissmatch(datas.new_password, datas.password_repeat)){
      reject('New passwords are not matching!');
    }
    resolve();
  })
}
module.exports.deleteProfInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(revisePwdOutRange(datas.old_password)){
      reject('Password is not acceptable!')
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
  return datas.age !== '' && datas.age > 6;
}




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



