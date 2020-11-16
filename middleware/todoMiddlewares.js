const verifyTodo = require('../utils/dataValidation/todoDatasValidity.js').todoValidation;
const verifyState = require('../utils/dataValidation/todoStateDataValidity.js');

module.exports.newContentVerification = (req, res, next)=>{
  verifyTodo(req.params.id, req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}

module.exports.changeTodoStateVerification = (req, res, next)=>{
  verifyState(req.body.status)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}
