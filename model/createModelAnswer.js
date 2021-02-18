const paths = require('../config/appConfig.js').routing_paths;

//Normal obj, that passes in reading or persisting process
module.exports.forInformativeObj = (itemToReport, msg)=>{
  return {report: itemToReport, message: msg}
}


// FOR PROFILES //
module.exports.forProfileObj = (rawProf, msg)=>{
  return {report: createProfileResult(rawProf, false), message: msg };
}
module.exports.forProfileCreation = (rawProf, msg)=>{
  return {report: createProfileResult(rawProf, true), message: msg };
}
function createProfileResult(rawProf, isItForCreation){
  let name = rawProf.first_name;
  if(rawProf.last_name)
    name += ` ${rawProf.last_name}`;
  const publishable = {
    id: rawProf._id,
    fullname: name,
    age: rawProf.age,
    occupation: rawProf.occupation,

    manageProfile: `${paths.basePath}${rawProf._id}`,
    logoutProfile: `${paths.basePath}${rawProf._id}${paths.logoutPostfix}`,
    getAddTodos: `${paths.basePath}${rawProf._id}${paths.todoPostfix}`

  }
  if(isItForCreation){
    publishable.username = rawProf.username
    publishable.loginProfile= `${paths.basePath}${rawProf._id}${paths.loginPostfix}`
  }
  return publishable;
}

// FOR PROFILES //
module.exports.forProfileCollect = (rawArrayProfileFromDB, msg)=>{
  const publishableProfiles = rawArrayProfileFromDB.map((item) => {
    return {
      id: item._id,
      username: item.username,

      loginProfile: `${paths.basePath}${item._id}${paths.loginPostfix}`
    }
  });
  return { report: publishableProfiles, message: msg };
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

    updateStatus: `${paths.basePath}${rawTodo.owner}${paths.todoPostfix}/${rawTodo._id}${paths.updateStatusPostfix}`,
    updateNotation: `${paths.basePath}${rawTodo.owner}${paths.todoPostfix}/${rawTodo._id}${paths.updateNotationPostfix}`,
    deleteTodo: `${paths.basePath}${rawTodo.owner}${paths.todoPostfix}/${rawTodo._id}`
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





// FOR ERROR CASES
//Error obj, that MongoDB refused to read or persist
module.exports.forErrorObj = (itemToReport, id, msg) =>{
  return {report: itemToReport, involvedId: id, message: msg}
}
