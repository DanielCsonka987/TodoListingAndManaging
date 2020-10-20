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
    if(err){
      if(err.code !== 26) //NameSpaceNotFound -> collection dropped already
        expect(err).to.be.a('null');
    }
    ProfileSchema.insertMany(profileTestDatas, err=>{
      expect(err).to.be.a('null');
    });
  });
  setTimeout(()=>{done();}, 1000);
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
      expect(createInfo.report).to.not.be.a('null');
      expect(createInfo.report._id).to.not.be.a('null');
      expect(createInfo.message).to.be.a('string');
      expect(createInfo.message).to.equal('Creation done!');
      additionalPerson = createInfo.report;
    })
    .then(()=>{
      ProfileProcesses.loadInProfiles()
      .then((readInfo)=>{
        expect(readInfo).to.not.be.a('null');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        let createdFilter = readInfo.report
          .filter(item=> item._id.equals(additionalPerson._id) );
        expect(createdFilter).to.not.be.empty;
        expect(createdFilter.length).to.equal(1);
      })
      .catch((err)=>{ console.log('Readback error ', err) });
    })
    .catch((err)=>{ console.log('Error happened ', err) });
    setTimeout( ()=>{done();} , 80);
  })

  it('Reading single profile by id', (done)=>{
    ProfileProcesses.findThisProfileById(additionalPerson._id)
    .then(readInfo=>{
      expect(readInfo).to.not.be.a('null');
      expect(readInfo.report).to.not.be.a('null');
      expect(readInfo.report._id).to.not.be.a('null');
      expect(readInfo.report._id.toString())
        .to.equal(additionalPerson._id.toString());
      expect(readInfo.report.username.toString())
        .to.equal(additionalPerson.username.toString());
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
    })
    .catch(
      (errirInfo)=>{ console.log('Error happened ', err) });
    setTimeout(()=>{done();}, 50);
  });

  it('Reading single profile by username', (done)=>{
    ProfileProcesses.findThisProfileByUsername(additionalPerson.username)
    .then(readInfo=>{
      expect(readInfo).to.not.be.a('null');
      expect(readInfo.report).to.not.be.a('null');
      expect(readInfo.report._id).to.not.be.a('null');
      expect(readInfo.report._id.toString())
        .to.equal(additionalPerson._id.toString());
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
    })
    .catch((err)=>{ console.log('Error happened ', err) });
    setTimeout(()=>{done();}, 50);
  });

  it('Update password', (done)=>{
    ProfileProcesses.updateProfilePassword(additionalPerson._id, 'planning')
    .then((updateInfo)=>{
      expect(updateInfo).to.not.be.a('null');
      expect(updateInfo.report).to.not.be.a('null');
      expect(updateInfo.message).to.be.a('string');
      expect(updateInfo.message).to.equal('Update done!');
    })
    .then(()=>{
      ProfileProcesses.loadInProfiles()
      .then(readInfo=>{
        expect(readInfo).to.not.be.a('null');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        let updateProfile = readInfo.report
          .filter(item => item._id.equals(additionalPerson._id));
        expect(updateProfile).to.not.be.empty;
        expect(updateProfile[0].password).to.equals('planning');
      })
      .catch((err)=>{ console.log('Readback error ', err) });
    })
    .catch((err)=>{ console.log('Error happened ', err) });
    setTimeout(()=> done(), 80);
  })

  it('Delete existing profile', (done)=>{
    ProfileProcesses.deleteProfile(additionalPerson._id)
    .then((deletionInfo)=>{
      expect(deletionInfo).to.not.be.a('null');
      expect(deletionInfo.report).to.not.be.a('null');
      expect(deletionInfo.message).to.be.a('string');
      expect(deletionInfo.message).to.equal('Deletion done!');
    })
    .then(()=>{
      ProfileProcesses.loadInProfiles()
      .then((readInfo)=>{
        expect(readInfo).to.not.be.a('null');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        let deletedFilter = readInfo.report
          .filter(item=> item._id.equals(additionalPerson._id) );
        expect(deletedFilter).to.be.empty;
      })
      .catch((err)=>{ console.log('Readback error ', err) });
    })
    .catch( err=>{console.log('Error happened ',err)});
    setTimeout(()=>{done()}, 100);
  })

});


describe('Profile processes test - negatve set', ()=>{

  it('Profile seeking with non-existing id', (done)=>{
    ProfileProcesses.findThisProfileById('123456789012')
    .then(()=>{})
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.involvedId).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to
        .equal('No proper query answer is created!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Read malfunction!');
    });
    setTimeout(()=>{done();}, 50);
  })

  it('Profile seeking with non-existing username', (done)=>{
    ProfileProcesses.findThisProfileByUsername('stgToTest')
    .then(()=>{})
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.involvedId).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to
        .equal('No proper query answer is created!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Read malfunction!');
    });
    setTimeout(()=>{done();}, 50);
  })

  it('Profile creation without some essential datas 1', (done)=>{
    ProfileProcesses.createProfile( {
      username: 'stg',
      password: 'stg'
    })
    .then(()=>{})
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('MongoDB error!');
    });
    setTimeout(()=>{done();}, 50);
  });

  it('Profile creation without some essential datas 2', (done)=>{
    ProfileProcesses.createProfile( {
      first_name: 'Alisha',
      username: 'st',
      password: 'stg'
    })
    .then(()=>{})
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('MongoDB error!');
    });
    setTimeout(()=>{done();}, 50);
  });

  it('Profile update password with non-existing id', (done)=>{
    ProfileProcesses.updateProfilePassword('123456789012', 'stg')
    .then(()=>{})
    .catch(errorInfo =>{
      expect(errorInfo).to.be.not.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to.equal('No target to update!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Update unsuccessful!');
    });
    setTimeout(()=>{done();}, 50);
  })

  it('Profile deletion with non-existing id', (done)=>{
    ProfileProcesses.deleteProfile('123456789012')
    .then(()=>{})
    .catch(errorInfo=>{
      expect(errorInfo).to.be.not.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to.equal('No target to delete!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Deletion unsucessful!');
    })
    setTimeout(()=>{done();}, 50);
  })

});
