module.exports = (apiPath, method, input)=>{

  if(!apiPath){
    return { answer: { message: 'Front development error - no path!' }};
  }
  if(!method){
    return { answer: { message: 'Front development error - no method!' }};
  }
  let init = assembleTheInit(method);
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


function assembleTheInit(met){

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
