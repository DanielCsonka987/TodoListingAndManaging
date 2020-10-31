const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');

const PORT = process.env.PORT || 8080;
const dbAccessUrl = require('./config/appConfig.js').dbaccess;
const routerProfile = require('./control/routeProfiles.js');
const routerProfile = require('./control/routeProfilesLimited.js');
const createCookie = require('./middleware/cookieManager.js').cookieSetting;

mongoose.connect(dbAccessUrl, {useNewUrlParser: true, useUnifiedTopology: true} )
.then(()=>{
  console.log('MongoDB connection establised!');
  mongoose.connection
    .on('error', err=>{ console.log('MongoDB error occured: ', err) })
    .once('close', ()=>{ console.log('MongoDB connection closed!') })

  const app = express();
  app.use(cookieparser());
  app.use(bodyparser.urlencoded({extended: true}));

  // API response common configuration //
  app.all('/', (req, res, next)=>{
    res.setHeader('Content-Type', 'application/json' );
    next();
  })

  //resetting cookie if exsist
  app.all('/', (req, res, next)=>{
    if(req.cookies.name){
      res.cookie(createCookie(cookieIdentif));
    }
  }

  app.use('/api/profiles', routerProfile);
  app.use('/api/profiles/:id', routerProfile);


  // ERROR handling //
  app.all('/', (err, req, res, next)=>{
    console.log(err);
    res.status(err.defStatus);
    res.send(JSON.stringify( { err } );
  })

  app.listen(PORT, ()=>{
    console.log(`Server online at port:${PORT}`);
  });
})
.catch((err)=>{
  console.log('Server initializing stoped! ', err);
});
