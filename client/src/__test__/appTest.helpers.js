module.exports.assembleMockEnvelop = (sts1, sts2, values, msg)=>{
    if(sts1){
        return Promise.resolve({
            status: 200,
            text: ()=>{
                return Promise.resolve(
                    JSON.stringify({
                        status: sts2? 'success' : 'failed',
                        report: {
                            value: values
                        },
                        message: msg
                        
                })
            )}
        })
    }else{
        return Promise.reject({
            status: 400,
            text: ()=>{
                return Promise.resolve(
                    JSON.stringify({
                        status: 'failed',
                        report: {
                            value: values
                        },
                        message: msg
                        
                    })
                )}
        })
    }
}

module.exports.apiReportDatas = {
    startingProfDatas: [
        {
            id: '1234567890abcdef12345678',
            username: 'JohnD',
            loginUrl: '/profile/123/login'
        },
        {
            id: '0987654321fedcba98765432',
            username: 'testing',
            loginUrl: '/profile/456/login'
        }
    ],
    loggedUserDatas: {
        id: '1234567890abcdef12345678',
        fullname: 'John Doe',
        age: '32',
        occupation: 'Teacher',
        createNewTodo: '/profile/123/todos/',
        changePwdDelAccUrl: '/profile/123/',
        logoutUrl: '/profile/123/logout',
        todos: [
            {
                id: '1234567890abcdef12345678',
                task: 'Finish this app',
                priority: '9',
                status: 'Proceeding',
                notation: 'Too long developing time',
                start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
                update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
                notationChangeUrl: 'todo/123a/note',
                statusChangeUrl: 'todo/123a/status',
                removingUrl: 'todo/123a'
            },
            {
                id: '1234567890abcdef87654321',
                task: 'Study javascript more agile',
                priority: '6',
                status: 'Proceeding',
                notation: 'Too lasy you are',
                start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
                update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
                notationChangeUrl: 'todo/123b/note',
                statusChangeUrl: 'todo/123b/status',
                removingUrl: 'todo/123b'
            }
        ]
    },
    regLoginDatas: {
        id: 'abcdef1234567890abcdef12',
        username: 'PossibUname',
        fullname: 'MyName IsNobody',
        age: '29',
        occupation: 'Programmer',
        loginUrl: '/profile/abc/login',
        createNewTodo: '/profile/abc/todos/',
        changePwdDelAccUrl: '/profile/abc/',
        logoutUrl: '/profile/abc/logout',
        todos: []
    },
    newTodoDatas: {
        id: '123456abcdef123456abcdef',
        task: 'Finish the testing here!',
        priority: '6',
        notation: 'Nat far from the finish...',
        start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        notationChangeUrl: 'todo/987/note',
        statusChangeUrl: 'todo/987/status',
        removingUrl: 'todo/987'
    }
}

module.exports.userInputs = {
    toRegister: {
        username: 'PossibUname',
        password: 'PwdTest12',
        firstName: 'MyName',
        lastName: 'IsNobody',
        age: '29',
        occupation: 'Programmer'
    },
    toLogin: {
        password1: 'StgToTest1',
        password2: 'stgToT3st@',
        badPwd1: 'No',
        badPwd2: '71'
    },
    toNewTodo: {
        task: 'Finish the testing here!',
        priority: '6',
        notation: 'Nat far from the finish...',
        start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        notationChangeUrl: 'todo/987/note',
        statusChangeUrl: 'todo/987/status',
        removingUrl: 'todo/987'
    },
    toNotationChange: 'This is the new notation!'
}

module.exports.guiStaticTexts = {
    regTileText: 'Registration',
    profListFirstMsg: 'Accessing for your activity list, login or register an account!',
    profListSecMsg: 'Accounts in the system:',
    profileNoContent: 'No content to show!',
    pwdLogInputLabel: 'Password:',
    loginBtnText: 'Login',
    logoutBtnText: 'Logout',
    pwdChangeBtnText: 'Change password',
    delAccountBtnText: 'Delete account',
    cancelBtnText: 'Cancel',
    fullnameRowHead: 'Fullname:',
    pwdChangeLabels: {
        inpPwd1: 'Old password:',
        inpPwd2: 'New password:',
        inpPwd3: 'Password again:',
    },
    profDelPwdInputLabel: 'Password:',
    registLabels: {
        unm: 'Username*:',
        pwd1: 'Password*:',
        pwd2: 'Password again*:',
        fnm: 'Firstname*:',
        lnm: 'Lastname:',
        age: 'Age:',
        ocp: 'Occupation:'
    },
    todoInputLabels:{
        taskInp: 'Task:*',
        priorInp: 'Priority:*',
        noteInp: 'Notation:'
    },
    todos: {
        openInputText: 'Add new activity',
        stateText: 'State:',
        cardTestId: 'todoCard',
        inputTestId: 'todoInputToTest',
        saveBtnClass: '.btnCreate',     //create new todo, notation change findihs
        cancelBtnClass: '.btnBack',
        cancelBtnText: 'cancel',
        stateChangeSelect: 'button[name="forStatus"]',   //do todo state change, toogle
        noteChangeSelect: 'button[name="forNotation"]', //do starting todo note change
        delTodoClass: '.btnDelete'  //both finish and start deletion
    }
}
module.exports.standardMsgFromServer = {
    profLoadSuccessMsg: 'Profiles loaded in!',
    profLoadEmpyComment: 'No content to show!',
    logSuccess: 'You have logged in!',
    logFail: 'Access denied!',
    regSuccess: 'You registered!',
    regFail: 'Registration failed!',
    logoutSuccess: 'You have logged out!',
    profPwdChanged: 'Password has changed!',
    profDeletion: 'Your account has been deleted!',
    todoCreateSuccess: 'Creation done!',
    todoDeletSuccess: 'Deletion done!',
    todoState: 'Status changed!',
    todoNote: 'Notation changed!'
}