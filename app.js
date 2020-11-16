const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const multer  = require('multer');
const upload = multer();

const PORT = process.env.PORT || 8080;
const dbAccessUrl = require('./config/appConfig.js').db_access;
const apiRouting = require('./config/appConfig.js').routing_paths;
const routerProfileAllowed = require('./control/routerProfilesAllowed.js');
const apiPathsrouterProfileLReg = require('./control/routerProfilesLog.js');
const routerLimitedProfile = require('./control/routerProfilesLimited.js');
const routerLimitedTodos = require('./control/routerTodosLimited.js');
const apiErrorHandler = require('./middleware/commonAPIErrorHendler.js');

mongoose.connect(dbAccessUrl, {useNewUrlParser: true, useUnifiedTopology: true} )
.then(()=>{
  console.log('MongoDB server connection establised!');

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

const app = express();
app.use(cookieparser());
app.use(bodyparser.urlencoded({extended: true}));
app.use(upload.array());

app.use(apiRouting.api_base, apiPathsrouterProfileLReg); // REGISTER
app.use(apiRouting.api_base_profile, routerProfileAllowed); // GET ALL PROFILES + LOGIN + LOGUT
app.use(apiRouting.api_base_profile, routerLimitedProfile); // SINGLE PROFILE GET+POST+PUT+DELETE
app.use(apiRouting.api_base_profile, routerLimitedTodos);  // TODO PROCESSES

// ERROR handling //
app.all('/', apiErrorHandler)

const server = app.listen(PORT, ()=>{
  console.log(`Server online at port:${PORT}`);
});


module.exports = server;  //MOCHA testing purose
