const mongoose = require('mongoose')
const { expect } = require('chai')

const ProfileModel = require('../../model/ProfileModel')
const dbaccess = require('../testConfig').testDBConnection;

const profileTestDatas = require('../profileTestDatas.js').profiles;
const additionalPersons = require('../profileTestDatas.js').newProfiles;

before(()=>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true })
        const dbConn = mongoose.connection;
        dbConn
            .once('open', ()=> console.log('MongoDB opened!'))
            .once('close', ()=> console.log('MongoDB closed!'))
            .on('error', (err)=> console.log('MongoDB error! ' + err));
        dbConn.collections.profiles.drop(err=>{
            if(err){ 
                console.log('Collection clearing failed!'); 
                console.log(err)
                reject(); 
            }
            ProfileModel.createCollection((err)=>{
                if(err){
                    console.log('Collection recreation failed!')
                }
                resolve();
            });
        });
    })
})

after(()=>{
    return new Promise( (resolve, reject)=>{
        mongoose.connection.close();
        resolve();
    })
})
describe('Profile processes complex tests',()=>{
    

    
    describe('Process with empty database', ()=>{
        it('Profle fetching attempt - no any in system', (done)=>{
            ProfileModel.collectAllProfiles(res=>{
                expect(res).to.not.be.undefined;
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('success')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('No content to show!')
                done();
            })
        })
    })
    describe('Profile reading method tests', ()=>{
        before((done)=>{
            ProfileModel.insertMany(profileTestDatas, err => {
                expect(err).to.be.a('null')
                done();
            })
        })
        it('Read in all profiles', (done)=>{
            ProfileModel.find({},(err, docs)=>{
                expect(err).to.be.a('null');
                expect(docs).to.be.a('array')
                const amount = docs.length;
                ProfileModel.collectAllProfiles((res)=>{
                    expect(res).to.be.a('object')
                    expect(res.status).to.be.a('string')
                    expect(res.status).to.equal('success')
                    expect(res.report).to.be.a('array')
                    expect(res.report).to.not.be.empty
                    expect(res.report.length).to.equal(amount)
                    done();
                })
            })
        })
        it('Seek single profile - at login process', (done)=>{
            const uName = profileTestDatas[3].username;
            ProfileModel.findOne({username: uName}, (err, doc)=>{
                expect(err).to.be.a('null')
                const uId = doc._id.toString();
                ProfileModel.findThisProfileToLogin(uId, (res)=>{
                    expect(res).to.be.a('object')
                    expect(res.status).to.be.a('string')
                    expect(res.status).to.equal('success')
                    expect(res.report).to.be.a('object')
                    expect(res.report.username).to.be.a('string')
                    expect(res.report.username).to.equal(uName)

                    const aUrl = res.report.logoutUrl;
                    expect(aUrl).to.be.a('string')
                    const idString = aUrl.split('/')[2]
                    expect(idString).to.be.a('string')
                    expect(idString).to.deep.equal(uId)

                    expect(res.report.todos).to.be.a('array')
                    expect(res.report.todos).to.be.empty
                    done();
                })
            })
        })
        it('Seek profile by name - at username collision', (done)=>{
            const uName= profileTestDatas[0].username;
            ProfileModel.findOne({ username: uName }, (err, doc)=>{
                expect(err).to.be.a('null');
                expect(doc).to.be.a('object')
                ProfileModel.findThisByUsername(uName, (sysRes)=>{
                    expect(sysRes).to.be.a('object')
                    expect(sysRes.status).to.be.a('string')
                    expect(sysRes.status).to.equal('success')
                    expect(sysRes.report).to.be.a('object')
                    expect(sysRes.report.id).to.not.be.undefined
                    expect(sysRes.report.id).deep.equal(doc._id)
                    expect(sysRes.report.username).to.be.a('string')
                    expect(sysRes.report.username).deep.equal(uName)
                    expect(sysRes.report.pwdHash).to.be.a('string')
                    done();
                })
            });             
        })
        it('Seek profile by id - ex. at cookie validate', (done)=>{ 
            const uName = profileTestDatas[1].username;
            ProfileModel.findOne({ username: uName }, (err, doc)=>{
                expect(err).to.be.a('null');
                expect(doc).to.be.a('object')
                ProfileModel.findThisById(doc._id, (sysRes)=>{
                    expect(sysRes).to.be.a('object');
                    expect(sysRes.status).to.be.a('string')
                    expect(sysRes.status).to.equal('success')
                    expect(sysRes.report).to.be.a('object')
                    expect(sysRes.report.id).to.not.be.undefined
                    expect(sysRes.report.id).deep.equal(doc._id);
                    expect(sysRes.report.username).to.be.a('string')
                    expect(sysRes.report.username).to.equal(uName)
                    expect(sysRes.report.pwdHash).to.be.a('string')
                    done();
                })
            })
        })
    })
    describe('Testing virtual methods', ()=>{

        it('Virtuals testing - less details', (done)=>{
            const uName = profileTestDatas[2].username;
            ProfileModel.findOne({ username: uName}, (err, doc)=>{
                expect(err).to.be.a('null')
                expect(doc).to.be.a('object')
                expect(doc.username).to.equal(uName);
                const extr = doc.basicProfileDatas;
                expect(extr).to.be.a('object')

                const aUrl = extr.loginUrl;
                expect(aUrl).to.be.a('string')
                const idString = aUrl.split('/')[2]
                expect(idString).to.be.a('string')
                expect(idString).to.deep.equal(doc._id.toString())

                expect(extr.username).to.equal(uName);
                done();
            })
        })
        it('Virtuals testing - more details login', (done)=>{
            const uName = profileTestDatas[3].username;
            const uFirstName = profileTestDatas[3].first_name;
            const uLastName = profileTestDatas[3].last_name;
            const uAge = profileTestDatas[3].age;
            ProfileModel.findOne( { username: uName }, (err, doc)=>{
                expect(err).to.be.a('null');
                expect(doc).to.be.a('object')
                const extr = doc.detailedProfileDatas_Login;
                expect(extr).to.be.a('object')

                const aUrl = extr.logoutUrl;
                expect(aUrl).to.be.a('string')
                const idString = aUrl.split('/')[2]
                expect(idString).to.be.a('string')
                expect(idString).to.deep.equal(doc._id.toString())

                expect(extr.fullname).to.equal(uFirstName + ' ' + uLastName)
                expect(extr.age).to.equal(uAge)
                done();
            })
        })
        it('Virtuals testing - more details register', (done)=>{
            const uName = profileTestDatas[3].username;
            const uFirstName = profileTestDatas[3].first_name;
            const uLastName = profileTestDatas[3].last_name;
            const uAge = profileTestDatas[3].age;
            ProfileModel.findOne( { username: uName }, (err, doc)=>{
                expect(err).to.be.a('null');
                expect(doc).to.be.a('object')
                const extr = doc.detailedProfileDatas_Register;
                expect(extr).to.be.a('object')

                const aUrl = extr.logoutUrl;
                expect(aUrl).to.be.a('string')
                const idString = aUrl.split('/')[2]
                expect(idString).to.be.a('string')
                expect(idString).to.deep.equal(doc._id.toString())

                expect(extr.id).to.be.a('object')
                expect(extr.fullname).to.equal(uFirstName + ' ' + uLastName)
                expect(extr.age).to.equal(uAge)
                done();
            })
        })
        it('Virtuals testing - system msg', (done)=>{
            const uName = profileTestDatas[3].username;
            ProfileModel.findOne( { username: uName }, (err, doc)=>{
                expect(err).to.be.a('null');
                expect(doc).to.be.a('object')
                const extr = doc.systemDatas;
                expect(extr).to.be.a('object')
                expect(extr.id).to.not.be.undefined;
                expect(extr.id).to.deep.equal(doc._id);
                expect(extr.username).to.equal(uName)
                expect(extr.pwdHash).to.be.a("string")
                done();
            })
        })
    })

    describe('Profile manipulation methods tests', ()=>{

        it('Createing new profile', (done)=>{
            const newProf = additionalPersons[1];
            ProfileModel.createNewProfile(newProf, (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('success')
                expect(res.report).to.be.a('object')

                const aUrl = res.report.logoutUrl;
                expect(aUrl).to.be.a('string')
                const idString = aUrl.split('/')[2]
                expect(idString).to.be.a('string')

                ProfileModel.findOne({username: newProf.username }, (err, doc)=>{
                    expect(err).to.be.a('null')
                    expect(doc).to.be.a('object')
                    expect(idString).to.deep.equal(doc._id.toString())
                    expect(res.report.username).to.equal(doc.username)
                    done();
                })

            })
        })

        it('Update password of a profile', (done)=>{
            const updProf = additionalPersons[1].username
            const newPwd = 'randomText';
            ProfileModel.findOne({ username: updProf}, (err, doc)=>{
                expect(err).to.be.a('null')
                expect(doc).to.be.a('object')
                expect(doc._id).to.not.be.undefined;
                const oldPwdHash = doc.password;
                ProfileModel.changePwdInProfile(doc._id, newPwd, (res)=>{
                    expect(res).to.be.a('object')
                    expect(res.status).to.be.a('string')
                    expect(res.status).to.equal('success')
                    expect(res.report).to.be.a('string')
                    expect(res.report).to.equal('')
                    ProfileModel.findOne({ username: updProf}, (error, doc2)=>{
                        expect(error).to.be.a('null')
                        expect(doc2).to.be.a('object')
                        expect(doc2.password).to.be.a('string')
                        expect(doc2.password).to.not.equal(oldPwdHash)
                        done();
                    })
                })
            })
        })

        it('Remove a profile', (done)=>{
            const updProf = additionalPersons[1].username
            ProfileModel.findOne({ username: updProf}, (err, doc)=>{
                expect(err).to.be.a('null')
                expect(doc).to.be.a('object')
                expect(doc._id).to.not.be.undefined;
                ProfileModel.removeThisProfile(doc._id, (res)=>{
                    expect(res).to.be.a('object')
                    expect(res.status).to.be.a('string')
                    expect(res.status).to.equal('success')
                    expect(res.report).to.be.a('string')
                    expect(res.report).to.equal('')
                    ProfileModel.findOne({ username: updProf}, (err, doc2)=>{
                        expect(err).to.be.a('null')
                        expect(doc2).to.be.a('null')
                        done();
                    })
                });
            })
        })
    })

    describe('Negative tests', ()=>{

        it('Faulty profile data request - no proper id', (done)=>{
            ProfileModel.findThisProfileToLogin('232', (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('DB error occured!')
                done();
            })
        })

        it('Faulty system profile seeking by id', (done)=>{
            ProfileModel.findThisById('232', (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('')
                done();
            })
        })
        it('Faulty system profile seeking by username', (done)=>{
            ProfileModel.findThisByUsername('232', (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('')
                done();
            })
        })
        it('Faulty profile creation - no all required content', (done)=>{
            ProfileModel.createNewProfile({ username: 'newUser', age: 32 }, (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('DB error occured!')
                done();
            })
        })
        it('Faulty profile password update 1 - empty string', (done)=>{
            ProfileModel.createNewProfile( '' , (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('DB error occured!')
                done();
            })
        })
        it('Faulty profile password update 2 - short string', (done)=>{
            ProfileModel.createNewProfile( '1' , (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('DB error occured!')
                done();
            })
        })
        it('Faulty profile deletion - no proper id', (done)=>{
            ProfileModel.createNewProfile( '312', (res)=>{
                expect(res).to.be.a('object')
                expect(res.status).to.be.a('string')
                expect(res.status).to.equal('failed')
                expect(res.report).to.be.a('string')
                expect(res.report).to.equal('DB error occured!')
                done();
            })
        })
    })
})