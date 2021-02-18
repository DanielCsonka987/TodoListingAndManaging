
function interpretProblems(err, parentMessageProp, parentStateSetter ){
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
        if(errorObject.errorType === 'exception'&& 
        typeof errorObject.content !== 'string'){
            // SERVER VALIDATION EXCETION, report with field-value pair
            if(errorObject.content.field){
              parentStateSetter({
                target:{
                  name: parentMessageProp,
                  value: {field: errorObject.content.field, 
                    msg: errorObject.message } 
                }
              })
            }else if(errorObject.content.todo){
              // special, for todos
              parentStateSetter({
                target:{
                  name: parentMessageProp,
                  value: {
                    ident: errorObject.content.todo? errorObject.content.todo : -1, 
                    msg: errorObject.message } 
                }
              })
            }else{
              console.log(errorObject)
            }
          
        }else{  // 404-500 SERVER ERROR - single string message
              // or SERVER VALIDATION EXCEPTION-simple answer
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