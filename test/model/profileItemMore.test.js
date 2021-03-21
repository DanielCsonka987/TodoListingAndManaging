const mongoose = require('mongoose')
const { expect } = require('chai')

const ProfileModel = require('../../model/ProfileItem')
const dbAccess =require('../../config/appConfig').db_access

const profileTestDatas = require('./profileTestDatas.js').profiles;
const additionalPersons = require('./profileTestDatas.js').newProfiles;

before(()=>{
    return new Promise(async (resolve, reject)=>{
         await mongoose.connect(dbAccess, 
            { useNewUrlParser: true, useUnifiedTopology: true })
        const dbConn = mongoose.connection;
        await dbConn
            .once('open', ()=> console.log('MongoDB opened!'))
            .once('close', ()=> console.log('MongoDB closed!'))
            .on('error', (err)=> console.log('MongoDB error! ' + err));
        await dbConn.collections.profiles.drop(async err=>{
            if(err){ 
                console.log('Collection clearing failed!'); 
                reject(); 
            }
            ProfileModel.insertMany(profileTestDatas, error => {
                if(error){ 
                    console.log('Test datas save failed! ' + err);
                    reject(); 
                }
                resolve();
            })
        });
    })
})

after(()=>{
    return new Promise( async (resolve, reject)=>{
        await mongoose.connection.close();
        resolve();
    })
})
describe('Profile processes complex tests',()=>{
    describe('Profile reading method tests', ()=>{
        it('Test', (done)=>{
            const uName= profileTestDatas[0].username;
            ProfileModel.findOne({ username: uName }, (err, doc)=>{
                ProfileModel.findThisByUsername(uName, (result)=>{
                    expect(result).deep.equal(doc)
                    done();
                })
            });
                
        })
        it('Test 2', (done)=>{
            const uName = profileTestDatas[1].username;
            ProfileModel.findOne({ username: uName }, (err, doc)=>{
                ProfileModel.findThisById(doc._id, (result)=>{
                    expect(result).deep.equal(doc);
                    done();
                })
            })
        })
    })
})