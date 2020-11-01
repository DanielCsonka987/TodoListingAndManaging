const router = require('express').Router();

const modelProfile = require('../model/profileProcesses.js');

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
