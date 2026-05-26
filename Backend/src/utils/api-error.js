class ApiError extends Error{
    constructor(
        statusCode,               // parameters
        message = "Something went worng",
        errors =[],
        stack = ""
    ){
        super(message) // calling parent class
        this.statusCode = statusCode
        this.data =null
        this.message = message
        this.success = true
        this.errors = errors
        if(stack){
            this.stack=stack
        }else{
          // stack not there then it generates with the help of below function  
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError};
