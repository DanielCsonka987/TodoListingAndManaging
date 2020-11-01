const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');

const PORT = process.env.PORT || 8080;
const dbAccessUrl = require('./config/appConfig.js').dbaccess;
const routerProfileAllowed = require('./control/routerProfilesAllowed.js');
const routerProfileLog = require('./control/routerProfilesLog.js');
const routerCookieAuth = require('./control/routerCookieAuth.js');
const routerLimitedProfile = require('./control/routerProfilesLimited.js');
const routerTodos = require('./control/routerTodos.js');
const createCookie = require('./middleware/cookieManager.js').cookieSetting;

mongoose.connect(dbAccessUrl, {useNewUrlParser: true, useUnifiedTopology: true} )
.then(()=>{
  console.log('MongoDB server connection establised!');

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
  });

  app.use('/api/profiles', routerProfileAllowed); //GET ALL + REGISTER
  app.use('/api/profiles', routerProfileLog); //LOGIN + LOGUT
  app.use('/api/profiles/:id', routerCookieAuth);  //COOKIE VALIDATION STRUCT + DB
  app.use('/api/profiles/:id', routerLimitedProfile); //PROFILE GET+POST+PUT+DELETE
  app.use('/api/profiles/:id/todos', routerTodos);  //TODO PROCESSES

  // ERROR handling //
  app.all('/', (err, req, res, next)=>{
    console.log(err);
    res.status(err.defStatus);
    res.send(JSON.stringify(err));
  })

  const server = app.listen(PORT, ()=>{
    console.log(`Server online at port:${PORT}`);
  });

  mongoose.connection
    .on('error', err=>{ console.log('MongoDB error occured: ', err) })
    .once('close', ()=>{
      console.log('MongoDB server connection closed!');
      server.close();
    })
})
.catch((err)=>{
  console.log('Server initializing stoped! ', err);
});
