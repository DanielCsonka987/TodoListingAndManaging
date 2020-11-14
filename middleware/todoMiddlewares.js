const verifyTodo = require('../utils/dataValidation/todoDatasValidity.js');
const verifyState = require('../utils/dataValidation/todoStateDataValidity.js');

module.exports.newContentVerification = (req, res, next)=>{
  verifyTodo(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}

module.exports.changeTodoStateVerification = (req, res, next)=>{
  verifyState(req.body.state)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400); //BAD REQUEST
    res.send(JSON.stringify(err));
  });
}
