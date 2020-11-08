const expect = require('chai').expect;
const assert = require('chai').assert;
const mongoose = require('mongoose');

const dbaccess = require('../../config/appConfig.js').dbaccess;
const ProfileSchema = require('../../model/profileItem.js');
const ProfileProcesses = require('../../model/profileProcesses.js');

let profileTestDatas = require('./profileTestDatas').profiles;
let additionalPerson = require('./profileTestDatas').newProfile;

before(()=>{
  return new Promise((resolve, reject)=>{
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
          resolve();
        });
      });
    }).catch(err=>{ console.log(err) });
});

after(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  }).catch(err=>{ console.log(err) });
});

describe('Profile processes test - positive set', ()=>{

  it('Reading in datas', ()=>{
    return ProfileProcesses.loadInProfiles()
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
  });

  it('Create new profile', ()=>{
    return ProfileProcesses.createProfile(additionalPerson)
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
  })

  it('Reading single profile by id', ()=>{
    return ProfileProcesses.findThisProfileById(additionalPerson._id)
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
    .catch((errirInfo)=>{ console.log('Error happened ', err) });

  });

  it('Reading single profile by username', ()=>{
    return ProfileProcesses.findThisProfileByUsername(additionalPerson.username)
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
  });

  it('Update password', ()=>{
    return ProfileProcesses.updateProfilePassword(additionalPerson._id, 'planning')
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
  })

  it('Delete existing profile', ()=>{
    return ProfileProcesses.deleteProfile(additionalPerson._id)
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
  })

});


describe('Profile processes test - negatve set', ()=>{

  it('Profile seeking with non-existing id', ()=>{
    return ProfileProcesses.findThisProfileById('123456789012')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
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
  })

  it('Profile seeking with non-existing username', ()=>{
    return ProfileProcesses.findThisProfileByUsername('stgToTest')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.report).to.be.a('array');
      expect(errorInfo.report).to.be.empty;
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('No content to show!');
    });
  })

  it('Profile creation without some essential datas 1', ()=>{
    return ProfileProcesses.createProfile( {
      username: 'stg',
      password: 'stg'
    })
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('MongoDB error!');
    });
  });

  it('Profile creation without some essential datas 2', ()=>{
    return ProfileProcesses.createProfile( {
      first_name: 'Alisha',
      username: 'st',
      password: 'stg'
    })
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch((errorInfo)=>{
      expect(errorInfo).to.not.be.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('MongoDB error!');
    });
  });

  it('Profile update password with non-existing id', ()=>{
    return ProfileProcesses.updateProfilePassword('123456789012', 'stg')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch(errorInfo =>{
      expect(errorInfo).to.be.not.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to.equal('No target to update!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Update unsuccessful!');
    });
  })

  it('Profile deletion with non-existing id', ()=>{
    return ProfileProcesses.deleteProfile('123456789012')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch(errorInfo=>{
      expect(errorInfo).to.be.not.a('null');
      expect(errorInfo.report).to.not.be.a('null');
      expect(errorInfo.report.explanation).to.be.a('string');
      expect(errorInfo.report.explanation).to.equal('No target to delete!');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Deletion unsucessful!');
    })
  })

});
