let mongoose = require('mongoose');
let assert = require('chai').assert;
let expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').dbaccess;
let ProfileSchema = require('../../model/profileItem.js');

let profileTestDatas = [
  {
    first_name: 'John',
    last_name: 'Doe',
    username: 'JohnD',
    password: 'test',
    age: 31,
    occupation: 'actor'
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    username: 'janed',
    password: 'retest',
    age: 43
  },
  {
    first_name: 'Jack',
    last_name: 'Nicholson',
    username: 'jack',
    password: 'nich',
    age: 64,
    occupation: 'actor'
  },
  {
    first_name: 'Sherlock',
    last_name: 'Holmes',
    username: 'holmes',
    password: 'strong',
    age: 61,
    occupation: 'detective'
  },
  {
    first_name: 'Lev',
    last_name: 'Tolstoj',
    username: 'levy',
    password: 'warpeace',
    age: 51,
    occupation: 'writer'
  }
]

let additionalPerson = {
  first_name: 'James',
  last_name: 'McCoy',
  username: 'mcco',
  password: 'machine',
  age: 23,
  occupation: 'engeneer'
}

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
      return ProfileSchema.findOne({first_name: 'Jack'}, (error, doc) =>{
        expect(error).to.be.a('null');
        expect(doc).to.not.be.a('null');
        assert.equal(doc.last_name, 'Nicholson', 'Single readed doc is failed');
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
          ProfileSchema.findOne({first_name: 'James'}, (error, doc)=>{
            expect(error).to.be.a('null');
            expect(doc).to.not.be.a('null');
            assert.equal(doc.last_name, 'McCoy', 'The created doc is not proper' + doc);
            resolve();
          });
        });
      }).catch(err=>{ console.log(err) });
    });
    it('Update the last added doc test', ()=>{
      return ProfileSchema.updateOne({first_name: "Sherlock"}, {age: 21}, (error, report)=>{
        expect(error).to.be.a('null');
        expect(report).to.not.be.a('null');
        assert.equal(report.nModified, 1, 'Update doesnt occured '+ report);
      }).catch(err=>{ console.log(err) });
    });
    it('Remove the last added doc test', ()=>{
      return ProfileSchema.deleteOne({first_name: "James"}, (error, report)=>{
        expect(error).to.be.a('null');
        expect(report).to.not.be.a('null');
        assert.equal(report.deletedCount, 1, 'Deletion doesnt occured '+ report);
      }).catch(err=>{ console.log(err) });
    });

  });
});
