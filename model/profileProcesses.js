const mongoose = require('mongoose');
const ProfileSchema = require('./profileItem.js');
const answerObj = require('./createModelAnswer.js').forModelObj;
const answerObjId = require('./createModelAnswer.js').forModelObjWithId;
const answerErr = require('./createModelAnswer.js').forErrorObj;
const answerErrId = require('./createModelAnswer.js').forErrorObjWithId;

module.exports.loadInProfiles = ()=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.find({}, (err, docs)=>{
      if(err) reject( answerErr(err, 'MongoDB error!', 'ldProf' ) );
      if(!docs) resolve( answerObj([], 'No content to show!') );
      else resolve( answerObj(docs, 'Reading done!') );
    })
  });
};

module.exports.findThisProfileById = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({_id: profileId}, (err, doc)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'findProf') );
      if(doc) resolve( answerObjId(profileId, doc, 'Reading done!') );
      else reject( answerErrId(profileId, null, 'Read malfunction!', 'findProf' ) );
    });
  });
};

module.exports.findThisProfileByUsername = (profileUsername)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({username: profileUsername}, (err, doc)=>{
      if(err) reject( answerErrId(profileUsername, err, 'MongoDB error!', 'findProf') );
      if(doc) resolve( answerObjId(profileUsername, doc, 'Reading done!') );
      else reject( answerErrId(profileUsername, null, 'Read malfunction!', 'findProf' ) );
    });
  });
};

module.exports.createProfile = (profile) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.create(profile, (err, doc)=>{
      if(err) reject( answerErr(err, 'MongoDB error!', 'crtProf') );
      if(doc) resolve( answerObj(doc, 'Creation done!') );
      else reject( answerErr( doc, 'Creation malfunction!', 'crtProf') );
    })
  });
};

module.exports.updateProfilePassword = (profileId, newPwdString) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.updateOne({_id: profileId}, {password: newPwdString},
    (err, rep)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'updtProfPwd') );
      if(!rep) reject( answerErrId(profileId, null, 'Update malfunction!', 'updtProfPwd') );
      if(rep.n === 0) reject( answerErrId(profileId, null, 'No target to update!', 'updtProfPwd') );
      if(rep.n === 1 && rep.nModified === 1)
        resolve( answerObjId(profileId, null, 'Update done!') );
      if(rep.n === 1 && rep.nModified === 0)
        reject( answerErrId(profileId, null, 'Update malfunction!', 'updtProfPwd') );
    });
  });
}

module.exports.deleteProfile = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({_id: profileId}, (err, rep)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'delProf') );
      if(!rep) reject(answerErrId(profileId, rep, 'Deletion malfunction!', 'delProf') );
      if(rep.n === 0)
        reject( answerErrId(profileId, null, 'No target to delete!', 'delProf') );
      if(rep.n === 1 && rep.deletedCount === 1)
        resolve( answerObjId(profileId, null, 'Deletion done!') );
      if(rep.n === 1 && rep.deletedCount === 0)
        reject( answerErrId(profileId, null, 'Deletion is cancelled', 'delProf') );

    });
  });
};
