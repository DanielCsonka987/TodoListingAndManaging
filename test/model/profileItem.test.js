let mongoose = require('mongoose');
let assert = require('chai').assert;
let expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').dbaccess;
let ProfileSchema = require('../../model/profileItem.js');

let profileTestDatas = [
  {
    first_name: 'John',
    last_name: 'Doe',
    age: 31,
    occupation: 'actor'
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    age: 43
  },
  {
    first_name: 'Jack',
    last_name: 'Nicholson',
    age: 64,
    occupation: 'actor'
  },
  {
    first_name: 'Sherlock',
    last_name: 'Holmes',
    age: 61,
    occupation: 'detective'
  },
  {
    first_name: 'Lev',
    last_name: 'Tolstoj',
    age: 51,
    occupation: 'writer'
  }
]

let additionalPerson = {
  first_name: 'James',
  last_name: 'McCoy',
  age: 23,
  occupation: 'engeneer'
}

describe('Model Profile CRUD operations', ()=>{

  before(done =>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection
      .once('open', ()=> console.log('MongoDB connected'))
      .on('error', (error)=> console.log('MongoDB error: ', error));

    mongoose.connection.collections.profiles.drop(err =>{
      if(err) console.log('MongoDB profiles collection is not empty!');

      ProfileSchema.insertMany(profileTestDatas, (err)=>{
        if(err) console.log('Failed insertion of test datas to MongoDB');
      });
    });
    setTimeout(()=>{ done();}, 800);  //MongoDB cloud server occupied - no async test attempt

  });

  after(done=>{
    mongoose.connection.close();
    done();
  });

  describe('Reading processes', ()=>{

    it('Read in one doc test', (done)=>{
      ProfileSchema.findOne({first_name: 'Jack'}, (error, doc) =>{
        expect(error).to.be.a('null');
        expect(doc).to.not.be.a('null');
        assert.equal(doc.last_name, 'Nicholson', 'Single readed doc is failed');
        done();
      });
    });
    it('Read in all doc test', (done)=>{
      ProfileSchema.find((error, docs)=>{
        expect(error).to.be.a('null');
        assert.equal(docs.length, 5, 'Not all docs are fetched ' + docs.length+ '/5');
        done();
      });
    });

  });

  describe('Manipulate processes', ()=>{
    it('Creation one additional test', (done)=>{
      let newProfile = new ProfileSchema(additionalPerson);
      newProfile.save(error=>{
            expect(error).to.be.a('null');
            ProfileSchema.findOne({first_name: 'James'}, (error, doc)=>{
              expect(error).to.be.a('null');
              expect(doc).to.not.be.a('null');
              assert.equal(doc.last_name, 'McCoy', 'The created doc is not proper' + doc);
              done();
            });
        });
    });
    it('Update the last added doc test', (done)=>{
      ProfileSchema.updateOne({first_name: "Sherlock"}, {age: 21}, (error, report)=>{
        expect(error).to.be.a('null');
        expect(report).to.not.be.a('null');
        assert.equal(report.nModified, 1, 'Update doesnt occured '+ report);
        done();
      });
    });
    it('Remove the last added doc test', (done)=>{
      ProfileSchema.deleteOne({first_name: "James"}, (error, report)=>{
        expect(error).to.be.a('null');
        expect(report).to.not.be.a('null');
        assert.equal(report.deletedCount, 1, 'Deletion doesnt occured '+ report);
        done();
      });
    });
  });

  // describe('Virtual processes', ()=>{
  //   it('Persistent data full name', (done)=>{
  //     ProfileSchema.findOne({ age: 43 }, (error, doc)=>{
  //       expect(error).to.be.a('null');
  //       expect(doc).to.not.be.a('null');
  //       doc.populate();
  //       let fullname = doc.fullName;
  //       expect(fullname).to.not.be.a('null');
  //       assert.isString(fullname, 'Not proper fullname content - no string result');
  //       assert.equal(fullname, 'Jane Doe', 'Not proper fullname content - no proper result');
  //       done();
  //        //It is failing the lack of correct management - occasionall appeared
  //
  //     });
  //   });
  // });


});
