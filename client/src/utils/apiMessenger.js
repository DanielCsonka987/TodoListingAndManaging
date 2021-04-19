const e = require('express');
const { serverException, serverError } = require('./errorObject')

module.exports.doAjaxSending = (apiPath, method, input)=>{
  if(!apiPath){
    return { message: 'Front development error - no path!' };
  }
  if(!method){
    return { message: 'Front development error - no method!' };
  }
  let init = smblTheInit(method);
  if(input){
    init.body = input;
    //console.log(init.body);
  }
  return fetch(apiPath, init)
  .then(apiResp => {

    const servMsg = JSON.parse(apiResp.json)
    if(servMsg.status === 'success'){
      return servMsg;
    }
  }).catch(errResp=>{
    let servMsg = ''
    try{
      servMsg = JSON.parse(errResp.json)
    }catch(e){
      console.log('Error url: ' + apiPath + ' ' + method)
      throw new Error(serverError('Api error! No such service!'))
    }
    throw new Error( serverException(servMsg) )
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
  dataCont += `username=${datas.username}&`;
  dataCont += `password=${datas.password}&`;
  dataCont += `password_repeat=${datas.password_repeat}&`;
  dataCont += `first_name=${datas.first_name}&`;
  dataCont += (datas.last_name === '')? 
    `last_name=&` : `last_name=${datas.last_name}&`;
  dataCont += (datas.age === '')? `age=0&` : `age=${datas.age}&`;
  dataCont += `occupation=${datas.occupation}`;
  return dataCont;
}
module.exports.smblLoginDatas = (unm, pwd) =>{
  let dataCont = '';
  dataCont += `username=${unm}&`;
  dataCont += `password=${pwd}`;
  return dataCont;
}
module.exports.smblPwdChangeDatas = (oldpwd, newpwd)=>{
  let dataCont = '';
  dataCont += `old_password=${oldpwd}&`;
  dataCont += `new_password=${newpwd}`;
  return dataCont;
}
module.exports.smblProfDeletDatas = (oldpwd)=>{
  return `old_password=${oldpwd}`;
}


// TODO DATAS ASSEMBLERS //
module.exports.smblNewTodoDatas = (datas)=>{
  let dataCont = '';
  dataCont += `task=${datas.task}&`;
  dataCont += `priority=${datas.priority}&`;
  dataCont += `notation=${datas.notation}`;
  return dataCont;
}
module.exports.smblStateChangeTodoDatas = (status)=>{
  return `status=${status}`;
}
module.exports.smblNotationChangeTodoDatas = (note)=>{
  return `notation=${note}`;
}
