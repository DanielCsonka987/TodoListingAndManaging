const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../app.js');
const dbaccess = require('../../config/appConfig.js').dbaccess;
const ProfileSchema = require('../../model/profileItem.js')

let userForTest = require('./profileTestDatas').registGoodProfile;

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on('error', err=>{ console.log('MongoDB error ', err) })
    .once('open', ()=>{ console.log('MongooseDB connection occured for test!') })
    .once('close', ()=>{ console.log('MongooseDB connection closed!') })
    resolve();

  }).catch(err=>{ console.log(err) });
})

after(function(){
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({username: userForTest.username}, (err, rep)=>{
      mongoose.connection.close();
      resolve();
    })
  }).catch(err=>{ console.log(err) });
})

describe('Read all user from api', function(){
  it('Read the users from api', function(){
    return chai.request(api).keepOpen()
      .get('/api/profiles/')
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('string');
        const resJSON = JSON.parse(res.body);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('array');
        expect(resJSON.report).to.not.be.empty;
      })
  })
})

describe('Proper login-out attempts', function(){

    it('Create a new users and login with that', function(){
      let agent = chai.request.agent(api);
      return agent.keepOpen()
        .post('/api/profiles/register')
        .type('form')
        .send(userForTest)
        .then((res)=>{
          expect(res).to.have.status(201);
          expect(res.text).to.be.a('string');
          const resJSON = JSON.parse(res.text);
          justRegUserId = resJSON.report._id;

          return agent.post(`/api/profiles/login`)
            .type('form')
            .send({
              'username': userForTest.username,
              'password': userForTest.password
            })
            .then((nextRes)=>{
              expect(nextRes).to.have.status(200);
              expect(nextRes).to.have.cookie('name', justRegUserId);
            })
        })
    })

    it('Login with that again and attempt a restricted process', function(){
      let agent = chai.request.agent(api);
      return agent.keepOpen()
        .post('/api/profiles/login')
        .type('form')
        .send({
          'username': userForTest.username,
          'password': userForTest.password
        })
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res.text).to.be.a('string');
          expect(res).to.have.cookie('name');
          // justLoggedinUserId = resJSON.report._id;
          justLoggedinUserId = res.cookie.name;
          expect(justLoggedinUserId).to.be.a('strung');

          return agent.get(`/api/profiles/${justLoggedinUserId}`)
            .then((nextRes)=>{
              console.log(nextRes);
              expect(nextRes).to.have.status(200);
              expect(nextRes).to.have.cookie('name', justLoggedinUserId);
              expect(rextRes.text).to.be.a('string');
              const resJSON = JSON.parse(rextRes.text);
              expect(resJSON.report).to.be.a('object');
              expect(resJSON.report._id).to.be.a('string');
            })
        })
    })

    // it('Login and logout process', function(){
    //   this.skip();
    //   let agent = chai.request.agent(api);
    //   return agent.keepOpen()
    //     .post('/api/profiles/login')
    //     .type('form')
    //     .send({
    //       'username': userForTest.username,
    //       'password': userForTest.password
    //     })
    //     .then((res)=>{
    //       expect(res).to.have.status(200);
    //       expect(res.text).to.be.a('string');
    //       const resJSON = JSON.parse(res.text);
    //       justRegUserId = resJSON.report._id;
    //
    //       return agent.get(`/api/profiles/login`)
    //         .type('form')
    //         .send({
    //           'username': userForTest.username,
    //           'password': userForTest.password
    //         })
    //         .then((nextRes)=>{
    //           expect(nextRes).to.have.status(200);
    //           expect(nextRes).to.have.cookie('name', justRegUserId);
    //
    //         })
    //     })
    // })

    // afterEach(function(){
    //   return new Promise((resolve, reject)=>{
    //     ProfileSchema.deleteOne({username: userForTest.username}, (err, rep)=>{
    //       if(err) reject();
    //       resolve();
    //     });
    //   });
    // })
})

// describe('Uncorrect login-out attempts', function(){
//
// })
