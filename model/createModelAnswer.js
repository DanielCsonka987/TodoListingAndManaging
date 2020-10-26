//Normal obj, that passes in reading or persisting process
module.exports.forModelObj = (itemToReport, msg)=>{
  return {report: itemToReport, message: msg}
}

//Error obj, that MongoDB refised to read or persist
module.exports.forDBErrorObj = (itemToReport, id, msg) =>{
  return {report: itemToReport, involvedId: id, message: msg}
}

//Error obj, query that executed, but MongoDB sent inconsistent answer
module.exports.forOwnErrorObj = (ownExpl, id, msg)=>{
  return {report: { explanation: ownExpl } , involvedId: id, message: msg}
}
