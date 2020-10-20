module.exports.forModelObj = (itemToReport, msg)=>{
  return {report: itemToReport, message: msg}
}

module.exports.forDBErrorObj = (itemToReport, id, msg) =>{
  return {report: itemToReport, involvedId: id, message: msg}
}

module.exports.forOwnErrorObj = (ownExpl, id, msg)=>{
  return {report: { explanation: ownExpl } , involvedId: id, message: msg}
}
