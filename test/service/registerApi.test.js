const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../app.js');
const mongooseProfileProc = require('../../model/profileProcesses.js');
const dbaccess = require('../../config/appConfig.js').db_access;
const ProfileSchema = require('../../model/profileItem.js');

const newUser = require('./profileTestDatas.js').registGoodProfile;
const faultyUsers = require('./profileTestDatas.js').registFaultyProfiles;

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .on('error', (err)=>{ console.log('MongoDB error: ', err); })
    .once('open', ()=>{ console.log('Test DB connection established!') })
    .once('close', ()=>{ console.log('Test DB connection closed') });
    resolve();
  }).catch(err=>{ console.log(err) });
});

after(function(){
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({username: newUser.username}, (err, rep)=>{
      expect(err).to.be.a('null');
      mongoose.connection.close();
      resolve();
    });
  }).catch(err=>{ console.log(err) })
})

describe('Register on api', function(){
  it('Register with normal datas', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(newUser)
      .end((err,res)=>{
        expect(err).to.be.a('null');
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        const sessionCookie = res.header['set-cookie'][0];
        expect(sessionCookie.includes('session')).to.be.true;

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
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
      expect(err).to.be.a('undefined');
    });
  })

  it('Register repetedly same username',function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(newUser)
      .end((err,res)=>{
        expect(err).to.be.a('null');
        expect(res).to.have.status(405);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('This username is already in use!');
        resolve();
      })
    }).catch(err=>{ console.log(err) })
  })

  it('Register without all needed datas - username missing', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[0]) //no username
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('The chosen username is not permitted!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })

  it('Register without all needed datas - password complitely missing', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[1]) //no password and confirmation
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('The chosen password is not permitted!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })
  it('Register without all needed datas - password confirmation missing', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[2]) //no password confirmation
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('No match between the password and its confirmation!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })
  it('Register without all needed datas - firstname missing', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[3]) //no firstname
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('This firstname is not permitted!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })

  it('Register with uncorrect demanded fields - short username', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[4]) //too short username
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('The chosen username is not permitted!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })

  it('Register with uncorrect demanded fields - failed password confirmation', function(){
    return new Promise((resolve, reject)=>{
      chai.request(api).keepOpen()
      .post('/api/register')
      .type('form')
      .send(faultyUsers[5]) //no proper password confirmation
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(400);
        expect(res.header['set-cookie']).to.be.a('undefined');
        
        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON).to.not.be.empty;
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('No match between the password and its confirmation!');
        resolve();
      })
    }).catch(err=>{ console.log(err) });
  })

})
