const router = require('express').Router();

const cookieVerify = require('../middleware/cookieManager.js').cookieVerify;
const createSessionCookie = require('../middleware/cookieManager.js').sessionCookie;

// COMMON processes that needs user authentication //
//revision if user manages its own profile
router.all('/:id', (req, res, next)=>{
  if(req.body.id === req.params.id){
    next();
  } else {
    res.status(401)   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'User interfering in another account!',
      involvedId: req.params.id,
      message: 'Management is permitted only at your account!'
    }));
  }
})
//authentication of cookie
router.all('/:id', (req, res, next)=>{
  const cookieToIdentif = req.cookies.[sessionCookieName];
  if(cookieToIdentif){
    cookieVerify.cookieVerify(cookieToIdentif)  //structural and DB revision
    .then(result=>{
      req.loginUserId = cookieToIdentif;
      next();
    })
    .catch(err=>{
      res.status(401);   //UNAUTHORIZED
      res.send(JSON.stringfy(err))
    });
  } else {
    res.status(401);   //UNAUTHORIZED
    res.send(JSON.stringify({
      report: 'No cookie to authenticate!',
      involvedId: '',
      message: 'User not logged in!'
    }));
  }
})

router.all('/:id', (req, res)=>{
  const propAttribs = createSessionCookie(offset);
  res.cookie( propAttribs.name, req.loginUserId,
      {
        path: propAttribs.path,
        expires: propAttribs.expireDate,
        httpOnly: propAttribs.httpOnly
      }
    );
})

module.exports = router;
