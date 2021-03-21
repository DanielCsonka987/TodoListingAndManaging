const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access;
const ProfileModel = require('../../model/ProfileItem.js');

const profileTestDatas = require('./profileTestDatas.js').profiles;
const additionalPersons = require('./profileTestDatas.js').newProfiles;

describe('Model Profile CRUD operations', ()=>{

  before(function(){
    return new Promise(async (resolve, reject)=>{
      await mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true });
      await mongoose.connection
        .once('open', ()=> { console.log('MongoDB connected!')   })
        .once('close', ()=>{  console.log('MongoDB closed!')  })
        .on('error', (error)=>{   console.log('MongoDB error: ', error);  })
      await mongoose.connection.collections.profiles.drop(async err =>{
        if(err) { 
          console.log('MongoDB profiles collection is not empty after removing!');
          reject();
        }
        await ProfileModel.insertMany(profileTestDatas, (err)=>{
          if(err){ 
            console.log('Failed insertion of test datas to MongoDB');
            reject();
          }
          resolve();
        });
      });
    });
  });

  after(function(){
    return new Promise(async (resolve, reject)=>{
      await mongoose.connection.close();
      resolve();
    });
  });

  describe('Reading processes', ()=>{

    it('Read in one doc test', (done)=>{
      ProfileModel.findOne({first_name: profileTestDatas[2].first_name},
        (error, doc) =>{
          expect(error).to.be.a('null');
          expect(doc).to.be.a('object');
          expect(doc.last_name).equal(profileTestDatas[2].last_name);
          done();
      });
    });

    it('Read in all doc test', (done)=>{
      ProfileModel.find((error, docs)=>{
        expect(error).to.be.a('null');
        expect(docs.length).to.equal(5);
        done();
      });
    });
  });

  describe('Manipulate processes', ()=>{

    it('Creation one additional test, first new adding', (done)=>{
      let newProfile = new ProfileModel(additionalPersons[0]);
      newProfile.save(async error=>{
        expect(error).to.be.a('null');
        ProfileModel.findOne({first_name: additionalPersons[0].first_name},
          (error, doc)=>{
            expect(error).to.be.a('null');
            expect(doc).to.be.a('object');
            expect(doc.last_name).equal(additionalPersons[0].last_name);
            done();
        });
      });
    });

    it('Update the last added doc test, 3rd age 61->21', (done)=>{
      ProfileModel.updateOne({first_name: profileTestDatas[3].first_name},
        {age: 21}, (error, report)=>{
          expect(error).to.be.a('null');
          expect(report).to.be.a('object');
          expect(report.nModified).equal(1);
          done();
      });
    });

    it('Remove the last added doc test', (done)=>{
      ProfileModel.deleteOne({first_name: additionalPersons[0].first_name},
        (error, report)=>{
          expect(error).to.be.a('null');
          expect(report).to.be.a('object');
          expect(report.deletedCount).equal(1);
          done()
      });
    });

  });
});
