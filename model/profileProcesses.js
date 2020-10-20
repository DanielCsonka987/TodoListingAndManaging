const mongoose = require('mongoose');
const ProfileSchema = require('./profileItem.js');
const answerObject = require('./createModelAnswer.js').forModelObj;
const answerDBError = require('./createModelAnswer.js').forDBErrorObj;
const anwerOwnError = require('./createModelAnswer.js').forOwnErrorObj;

module.exports.loadInProfiles = ()=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.find({}, (err, docs)=>{
      if(err) reject( answerDBError(err, null, 'MongoDB error!', 'ldProf' ) );
      if(!docs) resolve( answerObject([], 'No content to show!') );
      else resolve( answerObject(docs, 'Reading done!') );
    })
  });
};

module.exports.findThisProfileById = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({_id: profileId}, (err, doc)=>{
      if(err) reject( answerDBError(err, profileId, 'MongoDB error!') );
      if(doc) resolve( answerObject(doc, 'Reading done!') );
      else {
        reject( anwerOwnError( 'No proper query answer is created!',
          profileId, 'Read malfunction!') );
      }
    });
  });
};

module.exports.findThisProfileByUsername = (profileUsername)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({username: profileUsername}, (err, doc)=>{
      if(err) reject( answerDBError(err, profileUsername, 'MongoDB error!') );
      if(doc) resolve( answerObject(doc, 'Reading done!') );
      else {
        reject( anwerOwnError('No proper query answer is created!',
          profileUsername, 'Read malfunction!' ) );
      }
    });
  });
};

module.exports.createProfile = (profile) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.create(profile, (err, doc)=>{
      if(err) reject( answerDBError(err, null, 'MongoDB error!') );
      if(doc) resolve( answerObject(doc, 'Creation done!') );
      else { reject( anwerOwnError( 'No proper query answer is created!',
        doc, 'Creation malfunction!') );
      }
    })
  });
};

module.exports.updateProfilePassword = (profileId, newPwdString) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.updateOne({_id: profileId}, {password: newPwdString},
    (err, rep)=>{
      if(err) reject( answerDBError(err, profileId, 'MongoDB error!') );
      if(!rep){ reject( anwerOwnError('No proper query answer is created!',
        profileId, 'Update malfunction!') );
      }
      if(rep.n === 0){
        reject( anwerOwnError('No target to update!',
          profileId, 'Update unsuccessful!') );
      }
      else if(rep.n === 1 && rep.nModified === 1)
        resolve( answerObject(profileId, 'Update done!') );
      else{   //(rep.n === 1 && rep.nModified === 0)
        reject( anwerOwnError('Update is cancelled by DBMS!',
          profileId, 'Update malfunction!') );
      }
    });
  });
}

module.exports.deleteProfile = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({_id: profileId}, (err, rep)=>{
      if(err) reject( answerDBError(err, profileId, 'MongoDB error!') );
      if(!rep) reject(answerDBError(rep, profileId, 'Deletion malfunction!') );
      if(rep.n === 0){
        reject( anwerOwnError( 'No target to delete!',
         profileId, 'Deletion unsucessful!') );
      }
      else if(rep.n === 1 && rep.deletedCount === 1)
        resolve( answerObject(profileId, 'Deletion done!') );
      else {   //(rep.n === 1 && rep.deletedCount === 0)
        reject( anwerOwnError( 'Deletion is cancelled by DBMS!',
         profileId, 'Deletion unsucessful!') );
      }
    });
  });
};
