const verifyTodo = require('../utils/dataValidation/todoDatasValidity.js');

module.exports.todoContentVerification = (req, res, next)=>{
  verifyTodo(req.body)
  .then(result=>{
    next();
  })
  .catch(err=>{
    res.status(400);
    res.send(JSON.stringify(err));
  });
}
