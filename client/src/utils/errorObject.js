module.exports.clientError = (msg)=>{
    return JSON.stringify({
        errorType: 'client',
        messge: msg
    })
}
module.exports.serverError = (msg)=>{
    return JSON.stringify({
        errorType: 'server',
        message: msg
    })
}
module.exports.serverException = (obj)=>{
    delete obj.status;
    obj.errorType = 'exception'
    return JSON.stringify(
        obj
    );
}
module.exports.clientException = (fields)=>{
    return JSON.stringify({
        errorType: 'validation',
        report: fields
    });
}

