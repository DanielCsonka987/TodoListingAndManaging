
function interpretProblems(err, parentMessageProp, parentStateSetter){
  console.log(err.name)
    let errorObject = '';
    if(err.errorType){   // a front validator
         errorObject = err;
    }else if(typeof err === 'string'){
         errorObject = err 
    }else{  
      try{  // from ajaxAPI, server exceptions - simple or double JSON-stringifing !!
        errorObject = JSON.parse(err.message);
        if(!errorObject.errorType){
          errorObject = JSON.parse(errorObject);
        }
      }catch(e){   // other regular JavaScript error occured
        console.log(err)
        errorObject = err.name
        
      }
    } 

    if(errorObject.errorType === 'validation'){  // FRONT SENT ERROR
        parentStateSetter({
            target: {
                name: parentMessageProp,
                value: errorObject.content
            }
        })
    }else {  //SERVER SENT NORMAL exception OR error
      if(errorObject.content){ // SERVER VALIDATION EXCEPTION-for profile manage input
        parentStateSetter({
            target:{
                name: parentMessageProp,
                value: {field: errorObject.content.field, 
                    msg: errorObject.message } 
            }
        })
      }else{  // OTHER TYPE OF SERVER ERROR - single string message/404-500 errors
        parentStateSetter({
            target:{
                name: parentMessageProp,
                value: errorObject.message
            }
        })
      }
    }
}

export default interpretProblems