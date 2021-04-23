export class ServerError extends Error{
    constructor(msg, args){
        super(args)
        this.message = msg
        this.name = 'MyServerError'
    }
}


export class ServerException extends Error{
    constructor(obj, args){
        super(args)
        this.field = obj.report,
        this.message = obj.message
        this.name = 'MyServerException'
    }
}


export class ClientValidateException extends Error{
    constructor(errors, args){
        super(args)
        this.errorFields = errors
        this.name = 'MyClientValidateException'
        this.message = 'Input filed error(s) occured!'
    }
}


export class ClientError extends Error {
    constructor(msg, args){
        super(args)
        this.message = msg
        this.name = 'MyClientError'
    }
}

