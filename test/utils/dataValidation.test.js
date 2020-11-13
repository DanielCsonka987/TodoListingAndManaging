const expect = require('chai').expect;
const assert = require('chai').assert;

const TestTodoVerify =
  require('../../utils/dataValidation/todoDatasValidity.js')
  .testTodoValidation;
const ProductionTodoVerify =
  require('../../utils/dataValidation/todoDatasValidity.js')
  .todoValidation;
const TestProfileVerify =
  require('../../utils/dataValidation/registerDatasValidity.js')
  .testValidation;
const ProductionProfileVerify =
  require('../../utils/dataValidation/registerDatasValidity.js')
  .validation;
const LoginVerif = require('../../utils/dataValidation/loginDatasValidity.js');
const CookieVerif = require('../../utils/dataValidation/cookieDatasValidity.js');
const ChangePwdVerif = require('../../utils/dataValidation/pwdChangeDatasValidity.js');

describe('Registration datas verificiation - positive case', ()=>{
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

describe('Registration datas verificiation - negative case', ()=>{
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
      expect(err.message).to.equal('This firstname is not permitted!');
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
    TestTodoVerify({
      owner: '5faeceb497703d12d01fc74c',
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
    ProductionTodoVerify({
      owner: '5faeceb497703d12d01fc74c',
      task: 'Be ready to stdy new',
      priority: 10,
      notation: 'It is really important'
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.report).to.be.a('undefined');
      expect(res.notation).to.equal('It is really important');
    })
    .catch(err=> console.log('Error happened ',err));
    done();
  })
});

describe('Todo datas verificiation - negative case', ()=>{
  it('Todo without some essentail properties 1 - Test', (done)=>{
    TestTodoVerify({
      owner: '5faeceb497703d12d01fc74c',
      prority: 6
    }).then(res =>
      expect(res).to.be.a('undifined')
    ).catch(err =>{
      expect(err.name).to.be.a('string');
      expect(err.name).to.equal('ValidationError');
      expect(err.details).to.be.a('array');
    })
    done();
  })
  it('Todo without some essential properties 2 - Production', (done)=>{
    ProductionTodoVerify({
      task: 'Write HTML to this app',
      priority: 5,
      notation: 'Needed to be thinking in jsx'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('owner');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Missing profile identifier!');
    });
    done();
  })
  it('Todo without some essentail properties 3 - Production', (done)=>{
    ProductionTodoVerify({
      owner: '5faeceb497703d12d01fc74c',
      notation: 'Meaningless without the other properties'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.equal('task');
      expect(err.message).to.equal('Missing task description!');
    });
    done();
    it('Todo without some essentail properties 4 - Production', (done)=>{
      ProductionTodoVerify({
        owner: '5faeceb497703d12d01fc74c',
        task: 'Write HTML to this app',
        notation: 'Meaningless without the other properties'
      }).then(res =>
        expect(res).to.be.a('undefined')
      ).catch(err=>{
        expect(err.report).to.equal('Validation error!');
        expect(err.involvedId).to.equal('priority');
        expect(err.message).to.equal('Missing priority indicator!');
      });
      done();
    })
    it('Todo without proper owner identifier', function(){
      this.skip();
      return ProductionTodoVerify({})
    })
  })
});

describe('Login datas verification - positive/negative cases', ()=>{
  it('Correct composition', (done)=>{
    LoginVerif({
      username: 'somebody',
      password: '123that'
    })
    .then(res=>{
      expect(res).to.be.a('object');
      expect(res.username).to.be.a('string');
      expect(res.username).to.equal('somebody');
    })
    .catch(err=>{ expect(err).to.be.a('undefined') });
    done();
  });
  it('Missing username', (done)=>{
    LoginVerif({
      password: 'something'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Wrong username or password!');
    });
    done();
  })
  it('Missing password', (done)=>{
    LoginVerif({
      username: 'somebody'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Wrong username or password!');
    });
    done();
  })
  it('Wrong username', (done)=>{
    LoginVerif({
      username: 's'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Wrong username or password!');
    });
    done();
  })
  it('Wrong password', (done)=>{
    LoginVerif({
      password: 's'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Wrong username or password!');
    });
    done();
  })
})

describe('Cookie datas verification - positive/negative cases', function(){
  it('Good cookie input', function(){
    return CookieVerif('5faeceb497703d12d01fc74c')
    .then(res=>{
      expect(res).to.be.a('string');
    })
    .catch(err=>{ expect(err).to.be.a('undefined')});
  })
  it('Bad cookie input - less than needed', function(){
    return CookieVerif('5faeceb497703d12d01fc7')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Bad cookie in structure or content!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('5faeceb497703d12d01fc7');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Authentication error!')
    });
  })
  it('Bad cookie input - more than needed', function(){
    return CookieVerif('5faeceb497703d12d01fc74cacac')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Bad cookie in structure or content!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('5faeceb497703d12d01fc74cacac');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Authentication error!')
    });
  })
  it('Bad cookie input - different content than needed', function(){
    return CookieVerif('5faeceb497703d12drrrrrbc')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Bad cookie in structure or content!');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('5faeceb497703d12drrrrrbc');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Authentication error!')
    });
  })
})

describe('Change password datas verification - positive/negative cases', function(){

  it('Change user password with newpwd and oldpwd datas', function(){
    return ChangePwdVerif({
      password: 'test',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('object');
      expect(res.password).to.be.a('string');
      expect(res.password).to.equal('test');
      expect(res.old_password).to.be.a('string');
      expect(res.old_password).to.equal('test1');
    })
    .catch(err=>{
      expect(err).to.be.a('undefined');
    });
  })

  it('Change user password with no newpwd', function(){
    return ChangePwdVerif({
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('password');
    })
  })

  it('Change user password with no oldpwd', function(){
    return ChangePwdVerif({
      password: 'test'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('old password');
    })
  })
  it('Change user password with short newpwd', function(){
    return ChangePwdVerif({
      password: 't',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('string');
      expect(err.involvedId).to.equal('password');
    })
  })
})
