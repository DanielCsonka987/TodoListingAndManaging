
function interpretProblems(err, parentMessageProp, parentStateSetter ){
    let errorObject = '';

    if(err.name === 'MyClientValidateException'){   // a front validator, array

         
    }else if(err.name === 'MyClientError' ){

    }else if(err.name === 'MyServerException'){

    }else if(err.name === 'MyServerError'){

    }else{  //Unexpected type of error from somewhere
     
    } 

   
    parentStateSetter({
        target:{
            name: parentMessageProp,
            value: errorObject.message
        }
    })
}

export default interpretProblems