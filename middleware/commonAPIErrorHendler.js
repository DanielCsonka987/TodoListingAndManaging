const errorView =require('../view/middleView').forError

module.exports = (err, req, res, next)=>{
  console.log(err.stack);
  res.status(500);
  res.json( errorView.unknownError )
}
