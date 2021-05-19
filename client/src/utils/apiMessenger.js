const { ClientException, ServerException, ServerError, ServerValidateException } = require('./errorObject')

module.exports.doAjaxSending = (apiPath, method, input)=>{
  return new Promise( (resolve, reject)=>{
    if(!apiPath){
      throw new ClientException('Front development error - no path!')
    }
    if(!method){
      throw new ClientException('Front development error - no method!')
    }
    let init = smblTheInit(method);
    if(input){
      init.body = input;
      //console.log(init.body);
    }
    resolve({ apiPath, init })
  })
  .then( ( msgObj)=>{
    /*
    let servJSONMsg = ''
    await fetch(msgObj.apiPath, msgObj.init)
    .then(async apiResp => {
      servJSONMsg = await apiResp.text()
    })

    return JSON.parse(servJSONMsg)
    */

    return fetch(msgObj.apiPath, msgObj.init)
      .then(async apiResp=>{
        const res = await apiResp.text()
        //console.log(res)
        return await JSON.parse(res)
      })
  }).catch(async err=>{
    //console.log(err.message)
    if(err.name === 'MyClientException'){
      throw err
    }
    if( typeof err.text === 'function'){
      let servMsg = ''
      try{
        const servJSONMsg = await err.text()
        servMsg = JSON.parse(servJSONMsg)
      }catch(e){  //Server did not send processed JSON message
        console.log('Error url: ' + apiPath + ' ' + method)
        throw new ServerError('Api error! No such service!')
      }
      //Server defined precily the problem, it is validation connected
      if(servMsg.status=== 'failed' && servMsg.report.type === 'simple'){
        throw new ServerValidateException(servMsg)
      }
      //Sever defined precisely the problem, but not validation connected
      throw new ServerException(servMsg.message)  
    }else{
      throw new ServerError('Api error! Response undefined!')
    }
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
