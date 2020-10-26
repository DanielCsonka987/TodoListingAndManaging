const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 8080;
const dbAccessUrl = require('./config/appConfig.js').dbaccess;
const routerProfile = require('./control/routeProfiles.js');

mongoose.connect(dbAccessUrl, {useNewUrlParser: true, useUnifiedTopology: true} )
.then(()=>{
  console.log('MongoDB connection establised!');
  mongoose.connection
    .on('error', err=>{ console.log('MongoDB error occured: ', err) })
    .once('close', ()=>{ console.log('MongoDB connection closed!') })

  const app = express();
  app.use('/api/profiles', routerProfile);

  app.listen(PORT, ()=>{
    console.log(`Server online at port:${PORT}`);
  });
})
.catch((err)=>{
  console.log('Server initializing stoped! ', err);
});
