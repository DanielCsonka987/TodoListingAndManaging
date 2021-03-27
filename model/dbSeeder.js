const mongoose = require('mongoose')
const dbaccess = require('../config/appConfig.js').db_access_local;
const bcrypt = require('bcrypt');
const encrRound = require('../config/appConfig.js').validation_config.encryption_saltrounds;

const profiles = require('./dbDatasToExampleSite.js');
const ProfileModel = require('./ProfileItem.js');

mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{

  mongoose.connection.on('error', err=>{ console.log('MongoDB process error: ' + err) })
  .once('open', ()=>{ console.log('MongoDB opened to seed!') })
  .once('close', ()=>{
     console.log('MongoDB closed!')
     process.exit();
   });
  
  mongoose.connection.collections.profiles.drop(err=>{
    if(err){
      if(err.code !== 26)   //NameSpaceNotFound = collection already empty
        console.log('Profiles collection emptiing failed! ', err)
        mongoose.connection.close();
    }
    ProfileModel.insertMany(profiles, (error, res)=>{
        if(error){
          console.log('Profiles importing failed! ', error)
          mongoose.connection.close();
        }
        if(res.length !== profiles.length){
          console.log('Profiles importing failed! Different amount than expected!')
          console.log(res)
          mongoose.connection.close();
        }else{
          ProfileModel.find({}, (error2, result)=>{
            if(error2){
              console.log('Profiles readback failed! ', error2)
              mongoose.connection.close();
            }
            if(result.length !== profiles.length){
              console.log('Profiles readback failed! Different amount than expected!')
              console.log(result)
              mongoose.connection.close();
            }else{
              console.log(`Profile insertions done! ${profiles.length} users in the DB`)
              mongoose.connection.close();
            }
          })
        }
    })
  })
}).catch(e=> {
  console.log('Example site DB seeding failed! ' + e)
})
