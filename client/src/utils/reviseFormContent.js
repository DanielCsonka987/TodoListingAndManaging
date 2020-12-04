const usernameTest = new RegExp('^[a-zA-Z0-9_.]{4,80}$');
const ageTest = new RegExp('^[0-9]{1,3}$');

module.exports.registerInput = (datas)=>{
  return new Promise((resolve, reject)=>{

    if(!usernameTest.test(datas.username)){
      reject('Username is not acceptable!' + datas.username);
    }
    let dataCont = '';
    dataCont += 'username=' + datas.username + '&';
    if(!datas.password.length > 4 && !datas.password <= 40 ){
      reject('Password is not acceptable!')
    }
    dataCont += 'password=' + datas.password + '&';
    if(!datas.password === datas.password_repeat){
      reject('Password confirmation is not maching! ');
    }
    dataCont += 'password_repeat=' + datas.password_repeat + '&';
    if(datas.first_name.length === 0){
      reject('Firstname is not acceptable!')
    }
    dataCont += 'first_name=' + datas.first_name + '&';
    if(datas.last_name === ''){
      dataCont += 'last_name=&';
    }else{
      dataCont += 'last_name=' + datas.last_name + '&';
    }
    if(datas.age === ''){
      dataCont += 'age=0&';
    }else if(datas.age !== '' && !ageTest.test(datas.age)){
      reject('Age is not proper!' + datas.first_name.length)
    }else{
      dataCont += 'age=' + datas.age + '&';
    }
    dataCont += 'occupation=' + datas.occupaton;

    resolve(dataCont);

  })
}
module.exports.loginInput = ()=>{

}

module.exports.todoInput = ()=>{

}
