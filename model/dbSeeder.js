const mongoose = require('mongoose')
const dbaccess = require('../config/appConfig.js').db_access;
const bcrypt = require('bcrypt');
const encrRound = require('../config/appConfig.js').validation_config.encryption_saltrounds;

let profiles = require('./dbDatasToExampleSite.js').profileContent;
let todos = require('./dbDatasToExampleSite.js').todoContent;
const todoRation = todos.length / profiles.length;;

const ProfileSchema = require('./profileItem.js');
const TodoSchema = require('./todoItem.js');
const dbOpenTime = 2000;

function saveProfile(profileItem, pIndex){
  ProfileSchema.create(profileItem, (err, doc)=>{
    if(err) console.log('Profile persist error: ', err);

    console.log(`User no.${pIndex} is created!`)
    let tIndexes = [];
    for(let index = pIndex * todoRation; index < pIndex * todoRation + todoRation; index++){
      tIndexes.push(index);
    }
    tIndexes.forEach((defItemIndex, i) => {
      saveTodo( todos[defItemIndex] , doc._id);
      console.log(`Todo no.${defItemIndex} to user ${pIndex} is created!`)
    });
  })
}

function saveTodo(todoItem, ownerId){
  todoItem.owner = ownerId;
  TodoSchema.create(todoItem, (err, doc)=>{
    if(err) console.log('Todo persist error ', err)
  });
}

mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true })
.then( ()=>{

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
      }
  })
  mongoose.connection.collections.todos.drop(err=>{
    if(err){
      if(err.code !== 26)   //NameSpaceNotFound
      console.log('Todo collection emptiing failed! ', err)
    }
  })
  profiles.forEach((profItem, i) =>{
    bcrypt.hash(profItem.password, encrRound,  (err, hash)=>{
      if(err) console.log('Hashing error ' + err);
      profItem.password = hash;
      saveProfile(profItem, i);
    })
  })
  setInterval(()=>{
    mongoose.connection.close();
  }, dbOpenTime)

})
.catch(err=> {
  console.log('Example site DB seeding failed! ' + err)
})
