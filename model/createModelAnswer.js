const apiPaths = require('../config/appConfig.js').routing_paths;

//Normal obj, that passes in reading or persisting process
module.exports.forInformativeObj = (itemToReport, msg)=>{
  return {report: itemToReport, message: msg}
}


// FOR TODOS //
function singleTodoConverter(rawTodo){
  const publishable = {
    id: rawTodo._id,
    owner: rawTodo.owner,
    task: rawTodo.task,
    priority: rawTodo.priority,
    status: rawTodo.status,
    notation: rawTodo.notation,
    start: rawTodo.startingDate,
    update: rawTodo.lastModfingDate,

    updateStatus: `${apiPaths.api_base_path}/${rawTodo.owner}${apiPaths.api_todo}/${rawTodo._id}/status`,
    updateNotation: `${apiPaths.api_base_path}/${rawTodo.owner}${apiPaths.api_todo}/${rawTodo._id}/notation`,
    deleteTodo: `${apiPaths.api_base_path}/${rawTodo.owner}${apiPaths.api_todo}/${rawTodo._id}`
  }
  return publishable;
}

module.exports.forTodoCollect = (rawArrayTodoFromDB, msg)=>{
  const publishableTodos = rawArrayTodoFromDB.map((item) => {
    return singleTodoConverter(item);
  });
  return {report: publishableTodos, message: msg}
}

module.exports.forTodoObj = (rawTodo, msg)=>{
  return { report: singleTodoConverter(rawTodo), message: msg };
}

module.exports.forProfileObj = (rawProf, msg)=>{
  let name = rawProf.first_name;
  if(rawProf.last_name)
    name += ` ${rawProf.last_name}`;
  const publishable = {
    id: rawProf._id,
    username: rawProf.username,
    fullname: name,
    age: rawProf.age,
    occupation: rawProf.occupation,

    manageProfile: `${apiPaths.api_base_path}/${rawProf._id}`,
    logoutProfile: `${apiPaths.api_base_path}/${rawProf._id}${apiPaths.api_logout}`
  }
  return {report: publishable, message: msg };
}


// FOR PROFILES //
module.exports.forProfileCollect = (rawArrayProfileFromDB, msg)=>{
  const publishableProfiles = rawArrayProfileFromDB.map((item) => {
    return {
      id: item._id,
      username: item.username,

      loginProfile: `${apiPaths.api_base_path}/${item._id}${apiPaths.api_login}`
    }
  });
  return { report: publishableProfiles, message: msg };
}


// FOR ERROR CASES
//Error obj, that MongoDB refused to read or persist
module.exports.forErrorObj = (itemToReport, id, msg) =>{
  return {report: itemToReport, involvedId: id, message: msg}
}
