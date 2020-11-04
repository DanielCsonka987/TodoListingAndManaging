const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../app.js');
const mongooseProfileProc = require('../../model/profileProcesses.js');
const dbaccess = require('../../config/appConfig.js').dbaccess;

const newUser = {
  'username': 'meHere',
  'password': 'pwdText',
  'password_repeat': 'pwdText',
  'first_name': 'meHereAgain',
  'last_name': 'MrSomebody',
  'age': 31,
  'occupation': 'stranger'
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
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/profiles/register')
      .type('form')
      .send(newUser)
      .end((err,res)=>{
        expect(err).to.be.a('null');
        expect(res).to.have.status(202);
        expect(res.body).to.be.a('string');
        const resJSON = JSON.parse(res.body);
        expect(resJSON.message).to.equal('Creation done!');
        resolve();
      })
    })
    .then(()=>{
      mongooseProfileProc
      .findThisProfileByUsername(newUser.username)
      .then((result)=>{
        expect(result).to.be.a('object');
        expect(result.report).to.be.a('object');
        expect(result.message).to.be.a('string')
        expect(result.message).to.equal('Reading done!')
      })
    })
    .catch((err)=>{
      console.log('Error: ', err);
      // expect(err).to.be.a('undefined');
    });
  })

  it('Register repetedly same username',function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/profiles/register')
      .type('form')
      .send(newUser)
      .end((err,res)=>{
        expect(err).to.be.a('null');
        expect(res).to.have.status(405);
        const resJSON = JSON.parse(res.text);
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('This username is already in use!');
        resolve();
      })
    })
  })


})

describe('Login-out on api', function(){

})

describe('Read all users', function(){

})
