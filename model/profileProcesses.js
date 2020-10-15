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

module.exports.findThisProfile = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({_id: profileId}, (err, doc)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'findProf') );
      if(!doc) reject( answerErrId(profileId, '', 'Read malfunction!', 'findProf' ) );
      if(doc._id)  resolve( answerObjId(profileId, doc, 'Reading done!') );
      else  reject( answerErrId(profileId, '', 'Read malfunction!', 'findProf' ) );
    });
  });
};

module.exports.createProfile = (profile) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.create(profile, (err, doc)=>{
      if(err) reject( answerErr(err, 'MongoDB error!', 'crtProf') );
      if(doc._id) resolve( answerObj(doc, 'Creation done!'));
      else reject( answerErr( doc, 'Creation malfunction!', 'crtProf');
    })
  });
};

module.exports.updateProfilePassword = (profileId, newPwdString) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.updateOne({_id: profileId}, {password: newPwdString},
    (err, rep)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'updtProfPwd') );
      if(!rep) reject( answerErrId(profileId, rep, 'Update malfunction!', 'updtProfPwd') );
      if(rep.n === 0) reject( answerErrId(profileId, rep, 'No target to update!', 'updtProfPwd') );
      if(rep.n === 1 && rep.nModified === 1)
        resolve( answerObjId(profileId, rep, 'Update done!') );
      else
        reject( answerErrId(profileId, rep, 'Update malfunction!', 'updtProfPwd') );
    });
  });
}

module.exports.deleteProfile = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({_id: profileId}, (err, rep)=>{
      if(err) reject( answerErrId(profileId, err, 'MongoDB error!', 'delProf') );
      if(!rep) reject(answerErrId(profileId, rep, 'Deletion malfunction!', 'delProf') );
      if(rep.n === 1 && rep.deletedCount === 1)
        resolve( answerObjId(profileId, rep, 'Deletion done!') );
      else {
        reject( answerErrId(profileId, rep, 'Deletion malfunction!', 'delProf') );
      }
    });
  });
};
