const expect = require('chai').expect;
const assert = require('chai').assert;
const mongoose = require('mongoose');

const dbaccess = require('../../config/appConfig.js').dbaccess;
const ProfileSchema = require('../../model/profileItem.js');
const ProfileProcesses = require('../../model/profileProcesses.js');

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
  username: 'mc',
  password: 'machine',
  age: 23,
  occupation: 'engeneer'
}

before((done)=>{
  mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connection
    .on('error', (err)=> { console.log('MongoDB error ', err)})
    .once('open', ()=>{ console.log('MongoDB connection established') })
    .once('close', ()=>{ console.log('MongoDB closed properly') })

  mongoose.connection.collections.profiles.drop((err)=>{
    expect(err).to.be.a('null');
    ProfileSchema.insertMany(profileTestDatas, err=>{
      expect(err).to.be.a('null');
    });
  });
  setTimeout(()=>{done();}, 800);
});

after((done)=>{
  mongoose.connection.close();
  done();
});

describe('Profile processes test - positive set', ()=>{
  it('Reading in datas', (done)=>{
    ProfileProcesses.loadInProfiles()
    .then((readInfo)=>{
      // console.log(readInfo);
      expect(readInfo).to.not.be.a('null');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.not.be.empty;
      expect(readInfo.report.length).to.equal(5);
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
      expect(readInfo.report[1].username).to.equal(profileTestDatas[1].username);
    })
    .catch(err=>{ console.log('Error happened ', err) });
    setTimeout( ()=>{done();} , 50);

  });

  it('Create new profile', (done)=>{
    ProfileProcesses.createProfile(additionalPerson)
    .then((createInfo)=>{
      expect(createInfo).to.not.be.a('null');
      expect(createInfo._id).to.not.be.a('null');
      expect(createInfo.report).to.not.be.a('null');
      expect(createInfo.message).to.not.be.a('null');
      expect(createInfo.message).to.equal('Creation done!');
      additionalPerson = createInfo.report;
    })
    .then(()=>{

    })
    .catch((err)=>{ console.log('Error happened ', err) });
    setTimeout( ()=>{done();} , 50);
  })

  it('Delete existing profile', (done)=>{
    ProfileProcesses.deleteProfile(additionalPerson._id)
    .then((deletionInfo)=>{
      expect(deletionInfo).to.not.be.a('null');
      expect(deletionInfo._id).to.not.be.a('null');
      expcet(deletionInfo.report).to.not.be.a('null');
      expect(deletionInfo.message).to.not.be.a('null');
      expect(deletionInfo,message).to.equal('Deletion done!');
    })
    // .then()
    .catch( err=>{console.log('Error happened ',err)});
    setTimeout(()=>{done()}, 50);
  })

});


describe('Profile processes test - negatve set', ()=>{

});
