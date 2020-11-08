const router = require('express').Router();
const bcrypt = require('bcrypt');
const modelProfile = require('../model/profileProcesses.js');

// READ strict user details //
// USER fetching its details
router.get('/:id', (req, res)=>{
  modelProfile.findThisProfileById(req.param.id)
  .then(result =>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to show!',
      involvedId: req.param.id.toString(),
      message: 'Such user not have found!'
    })
  });
})




// UPDATE user pwd //
router.put('/:id', (req, res, next)=>{
  bcrypt.hash(req.body.password)
  .then(hashResult =>{
    req.hashedPassword = hashResult;
    next();
  })
  .catch(err=>{
    res.status(500);
    res.send(JSON.stringify({
      report: 'Password encription error!',
      involvedId: 'password',
      message: 'Server function error!'
    }));
  })
})
router.put('/:id', (req, res)=>{
  modelProfile.updateProfilePassword(req.param.id, req.body.hashedPassword)
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to update!',
      involvedId: req.param.id.toString(),
      message: 'Such user not have found!'
    })
  });
})




// DELETE the user account //
router.delete('/:id', (req, res)=>{
  modelProfile.deleteProfile()
  .then(result=>{
    res.status(200);
    res.send(JSON.stringify(result));
  })
  .catch(err=>{
    res.status(404);
    res.send({
      report: 'No such content to delete!',
      involvedId: req.param.id.toString(),
      message: 'Such user not have found!'
    })
  });
});

module.exports = router;
