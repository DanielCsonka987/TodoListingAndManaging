const router = require('express').Router();

const modelProfile = require('../model/profileProcesses.js');
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
    cookieVerify.cookieVerify(cookieToIdentif)
    .then(result=>{
      next();
    })
    .catch(err=>{
      err.defStatus(401);
      next(err);
    });
  } else {  next({
      report: 'No cookie to authetnticate!'
      involvedId: '',
      message: 'User not logged in!'
      defStatus: 401
    })
  }
}




// READ strict user details //
// USER fetching its details
router.get('/:id', (req, res)=>{
  modelProfile.findThisProfileById()
  .then(result =>{
    res.status(200);
  })
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})


// UPDATE user pwd //
router.put('/:id', (req, res)=>{
  modelProfile.updateProfilePassword()
  .then()
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
})

// DELETE the user account //
router.delete('/:id', (req, res)=>{
  modelProfile.deleteProfile()
  .then()
  .catch(err=>{
    err.defStatus = 404;
    throw new Error(err);
  });
});

module.exports = router;
