module.exports.loginValues={
    corExpls: [
        {
            username: 'JohnD',
            password: 'testPwd'
        },
        {
            username: 'Jane_D',
            password: 'testPwd2'
        },
        {
            username: 'Me1992',
            password: 'pa$$w0rd'
        }
    ],
    incorExpls: [
        {
            username: '',
            password: 'testPwd'
        },
        {
            username: 'stgUName',
            password: ''
        },
        {
            username: 'stgUName',
            password: 'p'
        },
        {
            username: 'un',
            password: 'testPwd'
        },
        {
            username: 'stgToError'
        },
        {
            password: 's0mePwd'
        }
    ]
}
module.exports.registration={
    corExpls: [
        {
            username: 'JohnD',
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'John',
            last_name: '',
            age: '',
            occupation: ''
        },
        {
            username: 'JohnD',
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'J',
            last_name: 'Doe',
            age: '',
            occupation: ''
        },
        {
            username: 'JohnD',
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'John',
            last_name: 'Doe',
            age: 34,
            occupation: 'Programmer'
        }
    ],
    incorExpls: [
        {
            username: 'j',
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'John',
            last_name: '',
            age: '',
            occupation: ''
        },
        {
            username: 'JohnD',
            password: 't',
            password_repeat: 't',
            first_name: 'John'
        },
        {
            username: 'JohnD',
            password: 'testPwd',
            password_repeat: 't',
            first_name: 'John',
            last_name: '',
            age: '',
            occupation: ''
        },
        {
            username: 'JohnD',
            password: 'test$Pwd',
            password_repeat: 'test$Pwd',
            first_name: '',
            last_name: '',
            age: '',
            occupation: ''
        },
        {
            username: 'JohnD',
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'J',
            last_name: 'Doe',
            age: -1,
            occupation: ''
        },
        {
            password: 'testPwd',
            password_repeat: 'testPwd',
            first_name: 'John',
            last_name: 'Doe',
            age: '',
            occupation: ''
        }
    ]
}

module.exports.passwordChange = {
    corExpls: [
        {
            old_password: 'testPwd',
            new_password: 'te$tPwd2',
            password_repeat: 'te$tPwd2'
        }
    ],
    incorExpls: [
        {
            old_password: '',
            new_password: 'te$tPwd2',
            password_repeat: 'te$tPwd2'
        },
        {
            old_password: 'testPwd',
            new_password: '',
            password_repeat: 'te$tPwd2'
        },
        {
            old_password: 'testPwd',
            new_password: 'te$tPwd2',
            password_repeat: 'te$tP2'
        },
        {
            new_password: 'te$tPwd2',
            password_repeat: 'te$tPwd2'
        }
    ]
}

module.exports.todoNotation={
    corExpls:[
        'This is a normap notation for a task to do!',
        ''
    ],
    incorExpls:[
        'This is a too long notation text to be a notationn for a task to do - not be stored in the database, because it is too long to manage, and anyway how will read it?'
    ]
}

module.exports.newTodo = {
    corExpls: [
        { 
            task: 'Do stg to testing this!',
            priority: 3,
            notation: ''
        },
        {
            task: 'Make a test entity of todo',
            priority: 4,
            notation: 'Because it is basic requirement'
        }
    ],
    incorExpls: [
        {
            task: '',
            priority: 1,
            notation: 'Not meaning, no task here to be valid'
        },
        {
            task: 'Some text, othervise is with incorrect prioirty',
            priority: 15,
            notation: ''
        },
        {
            task: 'Some text, othervise is with incorrect prioirty',
            priority: -1,
            notation: ''
        },
        {
            prioirty: 4,
            notation: 'None task definition'
        },
        {
            prioirty: 4,
            notation: 'None task definition'
        }
    ]
}