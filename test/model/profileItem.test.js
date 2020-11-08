const mongoose = require('mongoose');
const assert = require('chai').assert;
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').dbaccess;
const ProfileSchema = require('../../model/profileItem.js');

let profileTestDatas = require('./profileTestDatas.js').profiles;
let additionalPerson = require('./profileTestDatas.js').newProfile;

describe('Model Profile CRUD operations', ()=>{

  before(function(){
    return new Promise((resolve, reject)=>{
      mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true });
      mongoose.connection
        .once('open', ()=> console.log('MongoDB connected'))
        .on('error', (error)=> console.log('MongoDB error: ', error));
      mongoose.connection.collections.profiles.drop(err =>{
        if(err) console.log('MongoDB profiles collection is not empty!');
        ProfileSchema.insertMany(profileTestDatas, (err)=>{
          if(err) console.log('Failed insertion of test datas to MongoDB');
          resolve();
        });
      });
    }).catch(err=>{ console.log(err) });
  });

  after(function(){
    return new Promise((resolve, reject)=>{
      mongoose.connection.close();
      resolve();
    }).catch(err=>{ console.log(err) });
  });

  describe('Reading processes', ()=>{
    it('Read in one doc test', ()=>{
      return ProfileSchema.findOne({first_name: profileTestDatas[2].first_name},
        (error, doc) =>{
          expect(error).to.be.a('null');
          expect(doc).to.not.be.a('null');
          assert.equal(doc.last_name, profileTestDatas[2].last_name,
            'Single readed doc is failed');
      }).catch(err=>{ console.log(err) });
    });
    it('Read in all doc test', ()=>{
      return ProfileSchema.find((error, docs)=>{
        expect(error).to.be.a('null');
        assert.equal(docs.length, 5, 'Not all docs are fetched ' + docs.length+ '/5');
      }).catch(err=>{ console.log(err) });
    });

  });

  describe('Manipulate processes', ()=>{
    it('Creation one additional test', ()=>{
      return new Promise((resolve, reject)=>{
        let newProfile = new ProfileSchema(additionalPerson);
        newProfile.save(error=>{
          expect(error).to.be.a('null');
          ProfileSchema.findOne({first_name: additionalPerson.first_name},
            (error, doc)=>{
              expect(error).to.be.a('null');
              expect(doc).to.not.be.a('null');
              assert.equal(doc.last_name, 'McCoy',
                'The created doc is not proper' + doc);
              resolve();
          });
        });
      }).catch(err=>{ console.log(err) });
    });
    it('Update the last added doc test', ()=>{
      return ProfileSchema.updateOne({first_name: profileTestDatas[3].first_name},
        {age: 21}, (error, report)=>{
          expect(error).to.be.a('null');
          expect(report).to.not.be.a('null');
          assert.equal(report.nModified, 1, 'Update doesnt occured '+ report);
      }).catch(err=>{ console.log(err) });
    });
    it('Remove the last added doc test', ()=>{
      return ProfileSchema.deleteOne({first_name: additionalPerson.first_name},
        (error, report)=>{
          expect(error).to.be.a('null');
          expect(report).to.not.be.a('null');
          assert.equal(report.deletedCount, 1, 'Deletion doesnt occured '+ report);
      }).catch(err=>{ console.log(err) });
    });

  });
});
