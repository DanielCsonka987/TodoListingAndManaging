module.exports = (err, req, res, next)=>{
  console.log(err.stack);
  res.setStatus(500);
}
