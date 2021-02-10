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
  .then(apiResponse=>{
    //console.log(apiResponse)
    if(apiResponse.ok){
      return apiResponse.json();
    }
    // Backend => intput validation error / Login revise error /
    // Register process error /
    // Cookie content error / DB Error occured
    if(apiResponse.involvedId){ 
      console.log(`${apiResponse.report} ${apiResponse.involvedId}`)
      // These are well consumed by Front app
      if(apiResponse.involvedId.todos || apiResponse.involvedId.profile ||
        apiResponse.involvedId.field){
        return { 
          report: apiResponse.involvedId,
          message: apiResponse.mesage
        }
      }else{
        return { 
          report: '',
          message: apiResponse.mesage
        }
      }
    }
    return {
      message: 'Application error!'
    }
  })
  .catch(err=>{
    console.log(err);
    return { message: 'Application loader error!'}
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
  dataCont += `occupation=${datas.occupaton}`;
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
module.exports.smblStateChangeTodoDatas = (datas)=>{
  return `status=${datas.status}`;
}
module.exports.smblNotationChangeTodoDatas = (datas)=>{
  return `notation=${datas.notation}`;
}
