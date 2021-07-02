const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const multer  = require('multer');
const upload = multer();

const appConfigPorting = require('./config/appConfig').server.port
const PORT_FINAL = process.env.PORT || appConfigPorting;
const dbAccessUrl = require('./config/appConfig.js').db.db_access_cloud;
const apiRouting = require('./config/appConfig.js').routing;

const routerProfileAllowed = require('./control/routerProfilesAllowed.js');
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
app.use(express.static(path.resolve(__dirname, './clientBuild')))
app.disable('x-powered-by');

app.get("/", (req, res)=>{
  res.sendFile(path.resolve(__dirname, './clientBuild', 'index.html'))
})
app.get('/revdb', (req, res)=>{
  res.write(dbAccessUrl)
  res.write(mongoose.connection)
  res.send()
})
app.use(apiRouting.basePath, routerProfileAllowed); // GET ALL PROFILES + REG + LOGIN + LOGUT
app.use(apiRouting.basePath, routerLimitedProfile); // SINGLE PROFILE GET+POST+PUT+DELETE
app.use(apiRouting.basePath, routerLimitedTodos);  // TODO PROCESSES

// ERROR handling //
app.all('/', apiErrorHandler)

const server = app.listen(PORT_FINAL, ()=>{
  console.log(`Server online at port:${PORT_FINAL}`);
});


module.exports = server;  //MOCHA testing purose
