const router = require('express').Router();

const cookieVerify = require('../middleware/cookieManager.js').cookieVerify;

// COMMON processes that needs user authentication //
//revision if user manages its own profile
router.all('/:id', (req, res, next)=>{
  if(req.body.id === req.params.id){
    next();
  } else {
    next({
      report: 'User interfering in another account!',
      involvedId: req.params.id,
      message: 'Management is permitted only at your account!',
      defStatus: 401;   //UNAUTHORIZED
    });
  }
})
//authentication of cookie
router.all('/:id', (req, res, next)=>{
  const cookieToIdentif = req.cookies.name;
  if(cookieToIdentif){
    cookieVerify.cookieVerify(cookieToIdentif)  //structural and DB revision
    .then(result=>{
      res.cookie(createCookie(cookieToIdentif));  //cookie recreation
      next();
    })
    .catch(err=>{
      err.defStatus = 401;
      next(err);
    });
  } else {
    next({
      report: 'No cookie to authetnticate!'
      involvedId: '',
      message: 'User not logged in!'
      defStatus: 401
    })
  }
}

module.exports = router;
