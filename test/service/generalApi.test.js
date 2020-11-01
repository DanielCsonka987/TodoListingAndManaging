const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const mongoose = require('mongoose');

const api = require('../../app.js');
const mongooseProfileProc = require('../../model/profileProcesses.js');
const dbaccess = require('../../config/appConfig.js').dbaccess;

const newUser = {
  username: 'meHere',
  password: 'pwdText',
  first_name: 'meHereAgain',
  last_name: 'MrSomebody',
  age: 31,
  occupation: 'stranger'
}

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .on('error', (err)=>{ console.log('MongoDB error: ', err); })
    .once('open', ()=>{ console.log('Test DB connection established!') })
    .once('close', ()=>{ console.log('Test DB connection closed') });
    resolve();
  })
});

after(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  })
})

describe('Register on api', function(){
  it('Register with normal datas', function(){

  })
})

describe('Login-out on api', function(){

})

describe('Read all users', function(){

})
