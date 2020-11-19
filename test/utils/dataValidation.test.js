const expect = require('chai').expect;

const TodoVerify = require('../../utils/dataValidation/todoDatasValidity.js');
const ProfileVerify = require('../../utils/dataValidation/registerDatasValidity.js');
const LoginVerif = require('../../utils/dataValidation/loginDatasValidity.js');
const CookieVerif = require('../../utils/dataValidation/cookieDatasValidity.js');
const ChangePwdVerif = require('../../utils/dataValidation/pwdChangeDatasValidity.js');
const TodoStateVerify = require('../../utils/dataValidation/todoStateDataValidity.js');

describe('Registration datas verificiation - positive case', ()=>{
  it('Profile with required properties', (done)=>{
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
  it('Profile with all properties', (done)=>{
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

describe('Registration datas verificiation - negative case', ()=>{
  it('Profile lack of some essential property 1', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=>{
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.equal('This firstname is not permitted!');
    });
    done();
  })
  it('Profile lack of some essential property 2', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('first_name');
      expect(err.message).to.equal('This firstname is not permitted!');
    });
    done();
  })
  it('Profile lack of some essential property 3', (done)=>{
    ProfileVerify({
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('username');
      expect(err.message).to.equal('The chosen username is not permitted!');
    });
    done();
  })
  it('Profile lack of all essential property', (done)=>{
    ProfileVerify({
      last_name: 'Body',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('username');
      expect(err.message).to.equal('The chosen username is not permitted!');
    });
    done();
  })
  it('Profile without proper password property', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '12',
      password_repeat: '12',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('password');
      expect(err.message).to.equal('The chosen password is not permitted!');
    });
    done();
  })
  it('Profile without proper password repeat', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1243',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('password_repeat');
      expect(err.message).to.equal('No match between the password and its confirmation!');
    });
    done();
  })
});

describe('Todo datas verificiation - positive case', ()=>{
  it('Todo with essentail properties', (done)=>{
    TodoVerify('5faeceb497703d12d01fc74c', {
      task: 'Finish already TodoApp',
      priority: 9
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.task).to.equal('Finish already TodoApp');
    }).catch(err=>{console.log('Error happened ', err)})
    done();
  })
  it('Todo with all properties', (done)=>{
    TodoVerify('5faeceb497703d12d01fc74c', {
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
  it('Todo without some essentail properties 1', (done)=>{
    TodoVerify('5faeceb497703d12d01fc74c', {
      prority: 6
    }).then(res =>
      expect(res).to.be.a('undifined')
    ).catch(err =>{
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.message).to.be.a('string');
    })
    done();
  })
  it('Todo without some essential properties 2', (done)=>{
    TodoVerify('', {
      task: 'Write HTML to this app',
      priority: 5,
      notation: 'Needed to be thinking in jsx'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('owner');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Missing profile identifier!');
    });
    done();
  })
  it('Todo without some essentail properties 3', (done)=>{
    TodoVerify('5faeceb497703d12d01fc74c', {
      notation: 'Meaningless without the other properties'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId.field).to.equal('task');
      expect(err.message).to.equal('Missing task description!');
    });
    done();
    it('Todo without some essentail properties 4', (done)=>{
      TodoVerify('5faeceb497703d12d01fc74c', {
        task: 'Write HTML to this app',
        notation: 'Meaningless without the other properties'
      }).then(res =>
        expect(res).to.be.a('undefined')
      ).catch(err=>{
        expect(err.report).to.equal('Validation error!');
        expect(err.involvedId.field).to.equal('priority');
        expect(err.message).to.equal('Missing priority indicator!');
      });
      done();
    })
    it('Todo without proper owner identifier', function(){
      TodoVerify('5faeceb497703d12d', {
        task: 'Finish already TodoApp',
        priority: 9
      }).then(res=>
        expect(res).to.be.a('undefined')
      ).catch(err=>{
        expect(err.report).to.equal('Validation error!');
        expect(err.involvedId.field).to.equal('owner');
        expect(err.message).to.equal('Missing profile identifier!');
      });
      done();
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
  it('Only wrong username', (done)=>{
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
  it('Only wrong password', (done)=>{
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
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.cookieContent).to.equal('5faeceb497703d12d01fc7');
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
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.cookieContent).to.equal('5faeceb497703d12d01fc74cacac');
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
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.cookieContent).to.equal('5faeceb497703d12drrrrrbc');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Authentication error!')
    });
  })
})

describe('Change password datas verification - positive/negative cases', function(){
  it('Change user password with newpwd and oldpwd datas', function(){
    return ChangePwdVerif({
      new_password: 'test',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('object');
      expect(res.new_password).to.be.a('string');
      expect(res.new_password).to.equal('test');
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
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('new_password');
    })
  })

  it('Change user password with no oldpwd', function(){
    return ChangePwdVerif({
      new_password: 'test'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('old_password');
    })
  })
  it('Change user password with short newpwd', function(){
    return ChangePwdVerif({
      new_password: 't',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('new_password');
    })
  })
  it('Change user password with empty newpwd', function(){
    return ChangePwdVerif({
      new_password: '',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('new_password');
    })
  })
})

describe('Todo status verification - positive/negative cases', function(){
  it('A good status input 1', function(){
    return TodoStateVerify('true')
    .then(res=>{
      expect(res).to.be.a('string');
      expect(res).to.equal('true');
    })
    .catch(err=> expect(err).to.be.a('undefined'))
  })
  it('A good status input 2', function(){
    return TodoStateVerify('false')
    .then(res=>{
      expect(res).to.be.a('string');
      expect(res).to.equal('false');
    })
    .catch(err=> expect(err).to.be.a('undefined'))
  })

  it('A wrong status input 1 - text', function(){
    return TodoStateVerify('stg')
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('status');
      expect(err.involvedId.input).to.equal('stg');
      expect(err.message).to.equal('Todo state must be true or false!');
    })
  })
  it('A good status input 2 - none', function(){
    return TodoStateVerify('')
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('status');
      expect(err.involvedId.input).to.equal('');
      expect(err.message).to.equal('Todo state must be true or false!');
    })
  })
  it('A good status input 3 - number', function(){
    return TodoStateVerify(12)
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('Validation error!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.field).to.equal('status');
      expect(err.involvedId.input).to.equal(12);
      expect(err.message).to.equal('Todo state must be true or false!');
    })
  })
})
