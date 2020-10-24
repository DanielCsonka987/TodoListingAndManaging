const expect = require('chai').expect;
const assert = require('chai').assert;

const TodoVerify = require('../../middleware/dataValidation/todoDatasValidity.js');
const ProfileVerify = require('../../middleware/dataValidation/profileDatasValidity.js');

describe('Profile datas verificiation - positive case', ()=>{
  it('Todo with required properties', (done)=>{
    ProfileVerify({
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
    ProfileVerify({
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
  it('Todo lack of some essential property 1', (done)=>{
    ProfileVerify({
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
  it('Todo lack of some essential property 2', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
      expect(err.details.type).to.not.be.a('null');
    });
    done();
  })
  it('Todo lack of some essential property 3', (done)=>{
    ProfileVerify({
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
      expect(err.details.type).to.not.be.a('null');
    });
    done();
  })
  it('Todo lack of all essential property', (done)=>{
    ProfileVerify({
      last_name: 'Body',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
    });
    done();
  })
  it('Todo without proper password property 1', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '12',
      password_repeat: '12',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.name).to.equal('ValidationError');
      expect(err._original).to.be.a('object');
    });
    done();
  })
  it('Todo without proper password repeat', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1243',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
      expect(err.details[0].message).to.equal('"password_repeat" must be [ref:password]');
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
