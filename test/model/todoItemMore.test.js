const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access_local;
const ProfileModel = require('../../model/ProfileItem.js');
const TodoSchema = require('../../model/TodoSchema')

const profilesTodoTestDatas = require('./todoTestDatas').profilesWithTodos;
const newProfiles = require('./todoTestDatas').newProfilesWithoutTodos;
const bareTodos = require('./todoTestDatas').bareNewTodos

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
      .once('open', ()=> console.log('MongoDB test connection established'))
      .once('close', ()=> console.log('MongoDB test connection closed'))
      .on('error', (error)=> console.log('MongoDB error ', error));

      mongoose.connection.collections.profiles.drop(err=>{
        if(err){ 
          console.log('MongoDB todo collection is not empty!');
          console.log(err)
          reject();
        }
        ProfileModel.insertMany(profilesTodoTestDatas, (error)=>{
          if(error){ 
            console.log('Failed insertion of test datas to MongoDB');
            console.log(error)
            reject();
          }
          //setTimeout(()=>{
            resolve();
          //}, 400)
        })
      });
    }).catch((e)=>{
      mongoose.connection.close();
    })
});

after(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  })
});

describe('Integrated profile-todo tests', ()=>{

    
})