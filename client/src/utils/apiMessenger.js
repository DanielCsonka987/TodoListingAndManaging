module.exports.doAjaxSending = (apiPath, method, input)=>{
  if(!apiPath){
    return { answer: { message: 'Front development error - no path!' }};
  }
  if(!method){
    return { answer: { message: 'Front development error - no method!' }};
  }
  let init = smblTheInit(method);
  if(input){
    init.body = input;
    console.log(init.body);
  }

  return fetch(apiPath, init)
  .then(apiResponse=>{
    return apiResponse.json();
  })
  .catch(err=>{
    console.log(err);
    return { report: 'Application loader error!'}
  })
}
function smblTheInit(met){

  return {
    method: met,
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referencePolicy: 'origin'
  }

}


// PROFILE DATA ASSEMBLERS //
module.exports.smblRegisDatas = (datas) =>{
  let dataCont = '';
  dataCont += 'username=' + datas.username + '&';
  dataCont += 'password=' + datas.password + '&';
  dataCont += 'password_repeat=' + datas.password_repeat + '&';
  dataCont += 'first_name=' + datas.first_name + '&';
 
  if(datas.last_name === ''){
    dataCont += 'last_name=&';
  }else{
    dataCont += 'last_name=' + datas.last_name + '&';
  }
  if(datas.age === ''){
    dataCont += 'age=0&';
  }else{
    dataCont += 'age=' + datas.age + '&';
  }
  dataCont += 'occupation=' + datas.occupaton;

  return dataCont;
}
module.exports.smblLoginDatas = (datas) =>{
  let dataCont = '';
  dataCont += 'username=', datas.username
  dataCont += 'password=', datas.password;
  return dataCont;
}
module.exports.smblPwdChangeDatas = (datas)=>{
  let dataCont = '';
  dataCont += 'old_password=' + datas.old_password;
  dataCont += 'new_password=' + datas.new_password;
  return dataCont;
}
module.exports.smblProfDeletDatas = (datas)=>{
  let dataCont = 'old_password=' + datas.old_password
  return dataCont;
}


// TODO DATAS ASSEMBLERS //
module.exports.smblNewTodoDatas = (datas)=>{
  let dataCont = '';

  return dataCont;
}
module.exports.smblStateChangeTodoDatas = (datas)=>{
  let dataCont = '';

  return dataCont;
}
module.exports.smblNotationChangeTodoDatas = (datas)=>{
  let dataCont = '';

  return dataCont;
}
