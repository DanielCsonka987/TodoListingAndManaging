const expect = require('chai').expect;

const TodoVerify = require('../../utils/validation/todoDatasValidity.js');
const ProfileVerify = require('../../utils/validation/registerDatasValidity.js');
const LoginVerif = require('../../utils/validation/loginDatasValidity.js');
const CookieIdVerif = require('../../utils/validation/sessionIdValidity.js');
const ChangePwdVerif = require('../../utils/validation/pwdInputDatasValidity.js');
const TodoStateVerify = require('../../utils/validation/todoStateDataValidity.js');

describe('Registration datas verificiation - positive cases', ()=>{
  it('Profile with required properties', (done)=>{
    ProfileVerify({
      username: 'username',
      password: '1234',
      password_repeat: '1234',
      first_name: 'Some',
    }).then((res)=>{
      expect(res).to.be.a('object');
      expect(res.username).to.equal('username');
      done();
    }).catch(err=> expect(err).to.be.a('undefined') );
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
      done();
    }).catch(err=> expect(err).to.be.a('undefined') );
  })
});
describe('Registration datas verificiation - negative cases', ()=>{
  it('Profile lack of some essential property 1', (done)=>{
    ProfileVerify({
      username: 'username',
      first_name: 'Some',
      password: '1234',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=>{
      expect(err).to.be.a('string')
      expect(err).to.equal('password_repeat');
      done();
    });
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
      expect(err).to.be.a('string');
      expect(err).to.equal('first_name');
      done();
    });
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
      expect(err).to.be.a('string');
      expect(err).to.equal('username');
      done();
    });
  })
  it('Profile lack of all essential property', (done)=>{
    ProfileVerify({
      last_name: 'Body',
      age: 13,
      occupation: 'lawyer'
    }).then((res)=>{
      expect(res).to.be.a('undefined');
    }).catch(err=> {
      expect(err).to.be.a('string');
      expect(err).to.equal('username');
      done();
    });
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
      expect(err).to.be.a('string');
      expect(err).to.equal('password');
      done();
    });
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
      expect(err).to.be.a('string');
      expect(err).to.equal('password_repeat');
      done();
    });
  })
});
describe('Todo datas verificiation - positive case', ()=>{
  it('Todo with essentail properties', (done)=>{
    TodoVerify({
      task: 'Finish already TodoApp',
      priority: 9
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.task).to.equal('Finish already TodoApp')
      done();
    }).catch(err=> expect(err).to.be.a('undefined') )
  })
  it('Todo with all properties', (done)=>{
    TodoVerify({
      task: 'Be ready to stdy new',
      priority: 10,
      notation: 'It is really important'
    }).then(res=>{
      expect(res).to.be.a('object');
      expect(res.priority).to.equal(10);
      expect(res.notation).to.equal('It is really important');
      done();
    }).catch(err=> { expect(err).to.be.a('undefined') })
  })
});
describe('Todo datas verificiation - negative case', ()=>{
  it('Todo without some essentail properties 1', (done)=>{
    TodoVerify({
      prority: 6
    }).then(res =>
      expect(res).to.be.a('undifined')
    ).catch(err =>{
      expect(err).to.be.a('string');
      expect(err).to.equal('task');
      done();
    })
  })
  it('Todo without some essential properties 2', (done)=>{
    TodoVerify({
      task: 'Write HTML to this app',
      notation: 'Needed to be thinking in jsx'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('priority');
      done();
    });
  })
  it('Todo without some essentail properties 3', (done)=>{
    TodoVerify({
      notation: 'Meaningless without the other properties'
    }).then(res =>
      expect(res).to.be.a('undefined')
    ).catch(err=>{
      expect(err).to.be.a('string')
      expect(err).to.equal('task');
      done();
    });
  })
});
describe('Login datas verification - positive/negative cases', ()=>{
  it('Correct composition', (done)=>{
    LoginVerif({
      username: 'somebody',
      password: '123that$'
    })
    .then(res=>{
      expect(res).to.be.a('object');
      expect(res.username).to.be.a('string');
      expect(res.username).to.equal('somebody');
      done();
    })
    .catch(err=>{ expect(err).to.be.a('undefined') });
  });
  it('Missing username', (done)=>{
    LoginVerif({
      password: 'something'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('null');
      done();
    });
  })
  it('Missing password', (done)=>{
    LoginVerif({
      username: 'somebody'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('null');
      done();
    });
  })
  it('Only wrong username', (done)=>{
    LoginVerif({
      username: 's'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('null');
      done();
    });
  })
  it('Only wrong password', (done)=>{
    LoginVerif({
      password: 's'
    })
    .then(res=> { expect(res).to.be.a('undefined')})
    .catch(err=>{
      expect(err).to.be.a('null');
      done();
    });
  })
})
describe('Cookie ID verification - positive/negative cases', function(){
  it('Good cookie input', function(){
    return CookieIdVerif('5faeceb497703d12d01fc74c')
    .then(res=>{
      expect(res).to.be.a('string');
      expect(res).to.equal('5faeceb497703d12d01fc74c')
    })
    .catch(err=>{ expect(err).to.be.a('undefined')});
  })
  it('Bad cookie input - less than needed', function(){
    return CookieIdVerif('5faeceb497703d12d01fc7')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('null');
    });
  })
  it('Bad cookie input - more than needed', function(){
    return CookieIdVerif('5faeceb497703d12d01fc74cacac')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('null');
    });
  })
  it('Bad cookie input - different content than needed', function(){
    return CookieIdVerif('5faeceb497703d12drrrrrbc')
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('null');
    });
  })
})

describe('Change password datas verification - positive/negative cases', function(){
  it('Change user password with newpwd and oldpwd datas', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise({
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
    return ChangePwdVerif.pwdChangeInputPairRevise({
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('new_password');
    })
  })

  it('Change user password with no oldpwd', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise({
      new_password: 'test'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('old_password');
    })
  })
  it('Change user password with short newpwd', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise({
      new_password: 't',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('new_password');
    })
  })
  it('Change user password with empty newpwd', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise({
      new_password: '',
      old_password: 'test1'
    })
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('new_password');
    })
  })
  it('Change user password no input at all', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise()
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('unexpected');
    })
  })
  it('Change user password with empty object', function(){
    return ChangePwdVerif.pwdChangeInputPairRevise({})
    .then(res=>{
      expect(res).to.be.a('undefined');
    })
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('old_password');
    })
  })
})

describe('Single pwd revision - positive/negative cases', ()=>{
  it('Single password validation, proper one, no1', ()=>{
    return ChangePwdVerif.pwdContentRevise('test')
    .then(res=>{
      expect(res).to.be.a('string')
      expect(res).to.equal('test')
    })
    .catch(err =>{ expect(err).to.be.a('undefiend') })
  })
  it('Single password validation, proper one, no2', ()=>{
    return ChangePwdVerif.pwdContentRevise('tEst')
    .then(res=>{
      expect(res).to.be.a('string')
      expect(res).to.equal('tEst')
    })
    .catch(err =>{ expect(err).to.be.a('undefiend') })
  })
  it('Single password validation, proper one, no3', ()=>{
    return ChangePwdVerif.pwdContentRevise('te$t')
    .then(res=>{
      expect(res).to.be.a('string')
      expect(res).to.equal('te$t')
    })
    .catch(err =>{ expect(err).to.be.a('undefiend') })
  })
  it('Single password validation, proper one, no4', ()=>{
    return ChangePwdVerif.pwdContentRevise('t3st')
    .then(res=>{
      expect(res).to.be.a('string')
      expect(res).to.equal('t3st')
    })
    .catch(err =>{ expect(err).to.be.a('undefiend') })
  })
  it('Single password validation, short one', ()=>{
    return ChangePwdVerif.pwdContentRevise('t')
    .then(res=>{
      expect(res).to.be.a('undefined')
    })
    .catch(err =>{ 
      expect(err).to.be.a('string')
      expect(err).to.equal('old_password') 
    })
  })
  it('Single password validation, empty string', ()=>{
    return ChangePwdVerif.pwdContentRevise('')
    .then(res=>{
      expect(res).to.be.a('undefined')
    })
    .catch(err =>{ 
      expect(err).to.be.a('string')
      expect(err).to.equal('old_password') 
    })
  })
  it('Single password validation, with null', ()=>{
    return ChangePwdVerif.pwdContentRevise('')
    .then(res=>{
      expect(res).to.be.a('undefined')
    })
    .catch(err =>{ 
      expect(err).to.be.a('string')
      expect(err).to.equal('old_password') 
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

  it('A wrong status input 1 - simple text', function(){
    return TodoStateVerify('stg')
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('status');
    })
  })
  it('A good status input 2 - empty string', function(){
    return TodoStateVerify('')
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('status');
    })
  })
  it('A good status input 3 - number', function(){
    return TodoStateVerify(12)
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('status');
    })
  })
  it('A good status input 3 - null', function(){
    return TodoStateVerify()
    .then(res=> expect(res).to.be.a('undefined'))
    .catch(err=>{
      expect(err).to.be.a('string');
      expect(err).to.equal('status');
    })
  })
})
