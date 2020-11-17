const mongoose = require('mongoose');
const ProfileSchema = require('./profileItem.js');

const reportProcessResult = require('./createModelAnswer.js').forInformativeObj;
const collectionProfileResult = require('./createModelAnswer.js').forProfileCollect;
const singleProfileResult = require('./createModelAnswer.js').forProfileObj;
const errorResult = require('./createModelAnswer.js').forErrorObj;

const errorMessages = require('../config/appMessages.js').front_error_messages;
const doneMessages = require('../config/appMessages.js').front_success_messages;

module.exports.loadInProfiles = ()=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.find({}, (err, docs)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` ,  '',
          errorMessages.model_read) );
      }
      if(!docs) resolve( reportProcessResult([], 'No content to show!') );
      else resolve( collectionProfileResult(docs, doneMessages.read) );
    })
  });
};

module.exports.findThisProfileById = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({_id: profileId}, (err, doc)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` ,  profileId,
          errorMessages.model_read) );
      }
      if(doc) resolve( singleProfileResult(doc, doneMessages.read) );
      else {
        reject( errorResult( 'No proper query answer is created!',
          {profile: profileId}, errorMessages.model_read) );
      }
    });
  });
};

// LOGIN and LIMITED process - cookie revising if it is existing account //
module.exports.findThisProfileById_detailed = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({_id: profileId}, (err, doc)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` ,  profileId,
          errorMessages.model_read) );
      }
      if(doc) resolve( reportProcessResult(doc, doneMessages.read) );
      else {
        reject( errorResult( 'No such user in DB!',
          {profile: profileId}, errorMessages.model_read) );
      }
    });
  });
};
// REGISTARTION process - revising username collision //
module.exports.findThisProfileByUsername = (profileUsername)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.findOne({username: profileUsername}, (err, doc)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: profileUsername},
          errorMessages.model_read) );
      }
      if(doc) resolve( reportProcessResult(doc, doneMessages.read) ); //all content needed!!
      else {
        reject( reportProcessResult( [], 'No content to show!' ) );
      }
    });
  });
};

module.exports.createProfile = (newProfile) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.create(newProfile, (err, doc)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: newProfile.username},
          errorMessages.model_create) );
      }
      if(doc) resolve( singleProfileResult(doc, doneMessages.create) );
      else { reject( errorResult( 'No proper query answer is created!',
        {profile: newProfile.username}, errorMessages.model_create) );
      }
    })
  });
};

module.exports.updateProfilePassword = (profileId, newPwdHash) =>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.updateOne({_id: profileId}, {password: newPwdHash},
    (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: profileId},
          errorMessages.model_update) );
      }
      if(!rep){ reject( errorResult('No proper query answer is created!',
        {profile: profileId}, errorMessages.model_update) );
      }
      if(rep.n === 0){
        reject( errorResult('No target to update!',
          {profile: profileId}, errorMessages.model_update) );
      }
      else if(rep.n === 1 && rep.nModified === 1)
        resolve( reportProcessResult( {profile: profileId}, doneMessages.update) );
      else{   //(rep.n === 1 && rep.nModified === 0)
        reject( errorResult('Update is cancelled by DBMS!',
          {profile: profileId}, errorMessages.model_update) );
      }
    });
  });
}

module.exports.deleteProfile = (profileId)=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({_id: profileId}, (err, rep)=>{

      if(err){
        reject( errorResult( `DB error! ${err.name}` , {profile: profileId},
          errorMessages.model_delete) );
      }
      if(!rep){
        reject(  errorResult('No proper query answer is created!',
          {profile: profileId}, errorMessages.model_delete) );
      }
      if(rep.n === 0){
        reject( errorResult( 'No target to delete!',
         {profile: profileId}, errorMessages.model_delete) );
      }
      else if(rep.n === 1 && rep.deletedCount === 1)
        resolve( reportProcessResult({profile: profileId}, doneMessages.delete) );
      else {   //(rep.n === 1 && rep.deletedCount === 0)
        reject( errorResult( 'Deletion is cancelled by DBMS!',
         {profile: profileId}, errorMessages.model_delete) );
      }
    });
  });
};
