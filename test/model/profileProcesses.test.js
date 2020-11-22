const expect = require('chai').expect;
const assert = require('chai').assert;
const mongoose = require('mongoose');

const dbaccess = require('../../config/appConfig.js').db_access;
const ProfileSchema = require('../../model/profileItem.js');
const ProfileProcesses = require('../../model/profileProcesses.js');

let profileTestDatas = require('./profileTestDatas').profiles;
let additionalPerson = require('./profileTestDatas').newProfiles;

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
      expect(readInfo).to.be.a('object');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.not.be.empty;
      expect(readInfo.report.length).to.equal(5);
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
      expect(readInfo.report[1].username).to.equal(profileTestDatas[1].username);
    })
    .catch(err=>{ expect(err).to.be.a('undefined')  });
  });

  it('Create new profile', ()=>{
    return ProfileProcesses.createProfile(additionalPerson[0])
    .then((createInfo)=>{
      expect(createInfo).to.be.a('object');
      expect(createInfo.report).to.not.be.a('null');
      expect(createInfo.report.id).to.not.be.a('null');
      expect(createInfo.message).to.be.a('string');
      expect(createInfo.message).to.equal('Creation done!');
      additionalPerson[0] = createInfo.report;
    })
    .then(()=>{
      return ProfileProcesses.loadInProfiles()
      .then((readInfo)=>{
        expect(readInfo).to.be.a('object');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        const createdFilter = readInfo.report.filter(item=> item.id.equals(additionalPerson[0].id) );
        expect(createdFilter).to.not.be.empty;
        expect(createdFilter.length).to.equal(1);
      })
    })
    .catch((err)=>{expect(err).to.be.a('undefined') });
  })

  it('Reading single profile by id detailed', ()=>{
    return ProfileProcesses.findThisProfileById_detailed(additionalPerson[0].id)
    .then(readInfo=>{
      expect(readInfo).to.be.a('object');
      expect(readInfo.report).to.be.a('object');
      expect(readInfo.report._id).to.not.be.a('null');
      expect(readInfo.report._id.toString()).to.equal(additionalPerson[0].id.toString());
      expect(readInfo.report.username.toString()).to.equal(additionalPerson[0].username.toString());
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
    })
    .catch((err)=>{ expect(err).to.be.a('undefined') });
  });

  it('Reading single profile by id publicable', ()=>{
    return ProfileProcesses.findThisProfileById_detailed(additionalPerson[0].id)
    .then(readInfo=>{
      expect(readInfo).to.be.a('object');
      expect(readInfo.report).to.be.a('object');
      expect(readInfo.report.id).to.be.a('string');
      expect(readInfo.report.id.toString()).to.equal(additionalPerson[0].id.toString());
      expect(readInfo.report.username.toString()).to.equal(additionalPerson[0].username.toString());
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
    })
    .catch((errirInfo)=>{ expect(err).to.be.a('undefined')  });
  });

  it('Reading single profile by username', ()=>{
    return ProfileProcesses.findThisProfileByUsername(additionalPerson[0].username)
    .then(readInfo=>{
      expect(readInfo).to.be.a('object');
      expect(readInfo.report).to.be.a('object');
      expect(readInfo.report.id).to.be.a('string');
      expect(readInfo.report.id).to.equal(additionalPerson[0].id.toString());
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('Reading done!');
    })
    .catch((err)=>{ expect(err).to.be.a('undefined')  });
  });

  it('Update password', ()=>{
    return ProfileProcesses.updateProfilePassword(additionalPerson[0].id, 'planning')
    .then((updateInfo)=>{
      expect(updateInfo).to.be.a('object');
      expect(updateInfo.report).to.be.a('object');
      expect(updateInfo.report.profile).to.be.a('object');  //_bsontype, id
      expect(updateInfo.report.profile).to.equal(additionalPerson[0].id);
      expect(updateInfo.message).to.be.a('string');
      expect(updateInfo.message).to.equal('Updating done!');
    })
    .then(()=>{
      return ProfileProcesses.loadInProfiles()
      .then(readInfo=>{
        expect(readInfo).to.be.a('object');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        const updateProfile = readInfo.report.filter(item => item.id.equals(additionalPerson[0].id));
        expect(updateProfile).to.not.be.empty;
        expect(updateProfile[0].username).to.equal(additionalPerson[0].username);
      })
    })
    .catch((err)=>{ expect(err).to.be.a('undefined')  });
  })

  it('Delete existing profile', ()=>{
    return ProfileProcesses.deleteProfile(additionalPerson[0].id)
    .then((deletionInfo)=>{
      expect(deletionInfo).to.not.be.a('null');
      expect(deletionInfo.report).to.be.a('object');
      expect(deletionInfo.report.profile).to.be.a('object');  //_bsontype, id
      expect(deletionInfo.report.profile).to.equal(additionalPerson[0].id);
      expect(deletionInfo.message).to.be.a('string');
      expect(deletionInfo.message).to.equal('Deletion done!');
    })
    .then(()=>{
      ProfileProcesses.loadInProfiles()
      .then((readInfo)=>{
        expect(readInfo).to.not.be.a('null');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report).to.not.be.empty;
        const deletedFilter = readInfo.report.filter(item=> item.id.equals(additionalPerson[0].id) );
        expect(deletedFilter).to.be.empty;
      })
    })
    .catch( err=>{ expect(err).to.be.a('undefined') });
  })

});

describe('Profile processes test - negatve set', ()=>{

  it('Profile seeking with non-existing id', ()=>{
    return ProfileProcesses.findThisProfileById('123456789012')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch((errorInfo)=>{
      expect(errorInfo).to.be.a('object');
      expect(errorInfo.report).to.be.a('string');
      expect(errorInfo.report).to.equal('No proper query answer is created!');
      expect(errorInfo.involvedId).to.be.a('object');
      expect(errorInfo.involvedId.profile).to.be.a('string');
      expect(errorInfo.involvedId.profile).to.equal('123456789012');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Reading unsuccessful!');
    })
  })

  it('Profile seeking with non-existing username', ()=>{
    return ProfileProcesses.findThisProfileByUsername('stgToTest')
    .then((res)=>{
      expect(res).to.be.a('object');
      expect(res.report).to.be.a('object');
      expect(Object.keys(res.report).length).to.equal(0);
      expect(res.message).to.be.a('string');
      expect(res.message).to.equal('No content to show!');
    })
    .catch((errorInfo)=>{
      expect(errorInfo).to.be.a('undefined');
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
      expect(errorInfo).to.be.a('object');
      expect(errorInfo.report).to.be.a('string'); //DB error! ...
      expect(errorInfo.involvedId).to.be.a('object');
      expect(errorInfo.involvedId.profile).to.be.a('string');
      expect(errorInfo.involvedId.profile).to.equal('stg');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Creation unsuccessful!');
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
      expect(errorInfo).to.be.a('object');
      expect(errorInfo.report).to.be.a('string'); //DB error! ...
      expect(errorInfo.involvedId).to.be.a('object');
      expect(errorInfo.involvedId.profile).to.be.a('string');
      expect(errorInfo.involvedId.profile).to.equal('st');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Creation unsuccessful!');
    });
  });

  it('Profile update password with non-existing id', ()=>{
    return ProfileProcesses.updateProfilePassword('123456789012', 'stg')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch(errorInfo =>{
      expect(errorInfo).to.be.a('object');
      expect(errorInfo.report).to.be.a('string');
      expect(errorInfo.report).to.equal('No target to update!');
      expect(errorInfo.involvedId).to.be.a('object');
      expect(errorInfo.involvedId.profile).to.be.a('string');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Updating unsuccessful!');
    });
  })

  it('Profile deletion with non-existing id', ()=>{
    return ProfileProcesses.deleteProfile('123456789012')
    .then((res)=>{
      expect(res).to.be.a('undefined');
    })
    .catch(errorInfo=>{
      expect(errorInfo).to.be.a('object');
      expect(errorInfo.report).to.be.a('string');
      expect(errorInfo.report).to.equal('No target to delete!');
      expect(errorInfo.involvedId).to.be.a('object');
      expect(errorInfo.involvedId.profile).to.be.a('string');
      expect(errorInfo.involvedId.profile).to.equal('123456789012');
      expect(errorInfo.message).to.be.a('string');
      expect(errorInfo.message).to.equal('Deletion unsuccessful!');
    })
  })

});
