module.exports.forModelObj = (itemToReport, msg)=>{
  return {report: itemToReport, message: msg}
}

module.exports.forModelObjWithId = (id, itemToReport, msg)=>{
  let obj = exports.forModelObj(itemToReport, msg);
  obj.identifier = id;
  return obj;
}

module.exports.forErrorObj = (itemToReport, msg, src) =>{
  return {report: itemToReport, message: msg, source: src}
}

module.exports.forErrorObjWithId = (id, itemToReport, msg, src) =>{
  let obj = exports.forErrorObj(itemToReport, msg, src);
  obj.identifier = id;
  return obj;
}
