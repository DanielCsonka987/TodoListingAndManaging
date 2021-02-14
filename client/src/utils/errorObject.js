
module.exports.systemError = (msg)=>{
    return JSON.stringify({
        errorType: 'error',
        message: msg
    })
}
module.exports.serverException = (content, msg)=>{
    return JSON.stringify({
        errorType: 'exception',
        content: content,
        message: msg
    });
}
module.exports.clientException = (cont)=>{
    return {
        errorType: 'validation',
        content: cont
    };
}

