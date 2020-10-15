module.exports.forModelObj = (itemToReport, message)=>{
  return {report: itemToReport, message: message}
}

module.exports.forModelObjWithId = (id, itemToReport, message)=>{
  let obj = exports.forModelObj(itemToReport, message);
  obj._id = id;
  return obj;
}

module.exports.forErrorObj = (itemToReport, message, src) =>{
  return {report: itemToReport, message: message, source: src}
}

module.exports.forErrorObjWithId = (id, itemToReport, message, src) =>{
  let obj = exports.forErrorObj(itemToReport, message, src);
  obj._id = id;
  return obj;
}
