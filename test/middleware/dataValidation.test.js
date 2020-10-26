const expect = require('chai').expect;
const assert = require('chai').assert;

const TodoVerify = require('../../middleware/dataValidation/todoDatasValidity.js');
const TestProfileVerify =
  require('../../middleware/dataValidation/profileDatasValidity.js')
  .testValidation;
const ProductionProfileVerify =
  require('../../middleware/dataValidation/profileDatasValidity.js')
  .validation;

describe('Profile datas verificiation - positive case', ()=>{
  it('Todo with required properties', (done)=>{
    TestProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('object');
      expect(res.username).to.equal('username');
    }).catch(err=> console.log("Error happened "+err));
    done();
  })
  it('Todo with all properties', (done)=>{
    ProductionProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
      last_name: 'Body',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('object');
      expect(res.username).to.equal('username');
    }).catch(err=> console.log("Error happened "+err));
    done();
  })
});

describe('Profile datas verificiation - negative case', ()=>{
  it('Todo lack of some essential property 1 - Test', (done)=>{
    TestProfileVerify({
      username: 'username',
      password: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=>{
      expect(err.name).to.equal('ValidationError');
    });
    done();
  })
  it('Todo lack of some essential property 2 - Test', (done)=>{
    TestProfileVerify({
      username: 'username',
      password: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=>{
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
    });
    done();
  })
  it('Todo lack of some essential property 3 - Production', (done)=>{
    ProductionProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('first_name');
      expect(err.message).to.equal('This firstname is not permitted');
    });
    done();
  })
  it('Todo lack of some essential property 4 - Production', (done)=>{
    ProductionProfileVerify({
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('username');
      expect(err.message).to.equal('The chosen username is not permitted!');
    });
    done();
  })
  it('Todo lack of all essential property - Production', (done)=>{
    ProductionProfileVerify({
      last_name: 'Body',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('username');
      expect(err.message).to.equal('The chosen username is not permitted!');
    });
    done();
  })
  it('Todo without proper password property - Production', (done)=>{
    ProductionProfileVerify({
      username: 'username',
      password: '12',
      password_repeat: '12',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('password');
      expect(err.message).to.equal('The chosen password is not permitted!');
    });
    done();
  })
  it('Todo without proper password repeat - Production', (done)=>{
    ProductionProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1243',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('password_repeat');
      expect(err.message).to.equal('No match between the password and its confirmation!');
    });
    done();
  })
});

describe('Todo datas verificiation - positive case', ()=>{
  it('Todo with essentail properties', (done)=>{
    TodoVerify({
      owner: '1234567890abc',
      task: 'Finish already TodoApp',
      priority: 9
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.name).to.be.a('undefined');
      expect(res.task).to.equal('Finish already TodoApp');
    }).catch(err=>{console.log('Error happened ', err)})
    done();
  })
  it('Todo with all properties', (done)=>{
    TodoVerify({
      owner: '1234567890abc',
      task: 'Be ready to stdy new',
      priority: 10,
      notation: 'It is really important'
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.name).to.be.a('undefined');
      expect(res.notation).to.equal('It is really important');
    })
    .catch(err=> console.log('Error happened ',err));
    done();
  })
});

describe('Todo datas verificiation - negative case', ()=>{
  it('Todo without some essentail properties 1', (done)=>{
    TodoVerify({
      owner: '1234567890abc',
      prority: 6
    }).then(res =>
      expect(res).to.be.a('undifined')
    ).catch(err =>{
      expect(err.name).to.be.a('string');
      expect(err.name).to.equal('ValidationError');
    })
    done();
  })
  it('Todo without some essential properties 2', (done)=>{
    TodoVerify({
      task: 'Write HTML to this app',
      priority: 5,
      notation: 'Needed to be thinking in jsx'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.name).to.be.a('string');
      expect(err.details).to.be.a('array');
    });
    done();
  })
  it('Todo without all essentail properties', (done)=>{
    TodoVerify({
      notation: 'Meaningless without the other properties'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.name).to.be.a('string');
      expect(err.name).equal('ValidationError')
    });
    done();
  })
});
