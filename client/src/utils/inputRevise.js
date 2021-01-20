const usernameTest = new RegExp('^[a-zA-Z0-9_.]{4,80}$');
const ageTest = new RegExp('^[0-9]{1,3}$');

module.exports.regInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{

    if(!usernameTest.test(datas.username)){
      reject('Username is not acceptable!' + datas.username);
    }
    if(!datas.password.length >= 4 && !datas.password.length <= 40 ){
      reject('Password is not acceptable!')
    }
    if(datas.password.normalize() !== 
      datas.password_repeat.normalize()){
      reject('Password confirmation is not matching! ');
    }
    if(datas.first_name.length === 0){
      reject('Firstname is not acceptable!')
    }
    if(datas.age !== '' && !ageTest.test(datas.age)){
      reject('Age is not proper!' + datas.first_name.length)
    }
    resolve();
  })
}

module.exports.loginInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(!usernameTest.test(datas.username)){
      reject('Username is not acceptable!' + datas.username);
    }
    if(!datas.password.length >= 4 && !datas.password.length <= 40 ){
      reject('Password is not acceptable!')
    }
    resolve();
  })
}

module.exports.pwdChangeInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(!datas.password.length >= 4 && !datas.password.length <= 40 ){
      reject('Password is not acceptable!')
    }
    if(datas.password.normalize() !== 
      datas.password_repeat.normalize()){
      reject('Password confirmation is not matching! ');
    }
    resolve();
  })
}

module.exports.deleteProfInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{
    if(!datas.old_password.length >= 4 && !datas.old_password.length <= 40 ){
      reject('Password is not acceptable!')
    }
    resolve();
  })

}


module.exports.todoInputRevise = (datas)=>{
  return new Promise((resolve, reject)=>{

    if(datas.task === ''){
      reject('A task title required!');
    }
    if(datas.prioirty === '' || 
      (datas.priority < 0 && datas.priority > 10) ){
      reject('A priority is needed in range from 1 to 10!')
    }
    resolve();
  })
}
