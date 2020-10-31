const router = require('express').Router();

const cookieVerify = require('../middleware/cookieManager').cookieVerify;

router.all('/', (req, res, next)=>{
  const cookieIdentif = req.cookies.name;
  if(cookieIdentif{
    cookieVerify()
    .then()
    .catch();
  } else {
    next();
  }
});

router.get('/', (req,res)=>{

})

router.get('/:id', (req, res)=>{

})

router.post('/', (req, res)=>{

})

router.put('/:id/status', (req, res)=>{

})

router.put('/:id/notation', (req, res)=>{

})

router.delete('/:id', (req, res)=>{

})
