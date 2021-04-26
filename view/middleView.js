function viewUnit(sts, prcs, repType, repValue, msg){
    return {
        status: sts,
        report: {
            process: prcs,
            type: repType,
            value: repValue
        },
        message: msg
    }
}

// COOKIE MESSAGES //
module.exports.forCookies = {
    generalProblemMsg:  viewUnit('failed', 'cookie', 'none', '', 
        'Please, log in to use such service!'),
    paramMissmatchMsg: viewUnit('failed', 'cookie', 'none', '',
        'Management is permitted only at your account!'),
    loggedInStateMsg(state, todosCont){
        return viewUnit( state? 'success' : 'failed', 'cookie', state? 'array' : 'none', 
            state? todosCont : '', state? 'You are still logged in!' : 'You are not logged in!')
    }
}

// LOGIN MESSAGES //
module.exports.forLogin = {
    noProperLoginDatas: viewUnit('failed', 'loginDataFail', 'none', '',
        'Wrong username or password!'),
    noSuchUserInSystem: viewUnit('failed', 'loginLackOfUser', 'none', '', 
        'Wrong username or password!'), 
    differentParamAndUserid: viewUnit('failed', 'loginDiffParams', 'none', '', 
        'Wrong username or password!'),
    passwordNotAcceptable: viewUnit('failed', 'loginAuth', 'none', '', 
        'Wrong username or password!'), 
    passwordTestError: viewUnit('failed', 'loginAuth', 'none', '', 
        'System error occured!'),
    loginSuccess: (dbmsg) =>{
        return viewUnit('success', 'login', 'object', dbmsg, 
            'You have logged in!')
    },
    loginFail:  viewUnit('failed', 'login', 'none', '', 
        'System error occured!')
}

module.exports.forLogout = {
    success: viewUnit('success', 'logout', 'none', '', 'You have logged out!'),
    falied: viewUnit('failed', 'logout', 'none', '', 'System error occured!')
}


// REGISTER MESSAGES //
module.exports.forRegister ={
    registerDataFail: (problemKeyWord)=>{
        let msg = 'Validation error! '

        if(problemKeyWord === 'username')
            msg += 'The chosen username is not permitted!';
        else if(problemKeyWord === 'password')
            msg += 'The chosen password is not permitted!';
        else if(problemKeyWord === 'password_repeat')
            msg += 'No match between the password and its confirmation!';
        else if(problemKeyWord === 'unexpected')
            msg += 'Data verification failed!'
        else {
            const involvedKey = problemKeyWord.replace('_','');
            msg += `This ${involvedKey} is not permitted!`;
        }
        return viewUnit( 'failed', 'regValidate', 'simple', problemKeyWord,  msg )
    },
    usernameOccupied: viewUnit( 'failed', 'regRevise', 'simple', 'username',
        'This username is already in use!'),
    registeringError: viewUnit( 'failed', 'regPwdEncode', 'none', '',
        'System error occured!' ),
    regProfilePersistFail: viewUnit('failed', 'regPersist', 'none', '',
        'System error occured!'),
    registerSuccess: (dbmsg)=>{
        return viewUnit('success', 'regPersist', 'object', dbmsg,
            'Registration done!')
    }
}

module.exports.forProfiles = {
    // loading profile list
    readPublicProfilesFail: viewUnit('failed', 'readProf', 'none', '',
        'Reading error!'),
    readPublicProfilesSuccess(dbmsg){
        return viewUnit('success', 'readProf', 'array', dbmsg, 
            'Reading done!')
    },

    // general update/delete
    pwdRevisionFailed(problemKeyWord){
        let msg = ''
        if(problemKeyWord === 'unexpected'){
            msg += 'System error occured!'
        }else{
            const problem = problemKeyWord.replace('_', ' ')
            msg += `This ${problem} is not permitted!`
        }
        return viewUnit( 'failed', 'pwdManage', 'simple', problemKeyWord, msg )
    },

    // password change
    pwdHashRevisionFail: viewUnit( 'failed', 'pwdManage', 'simple', 'old_password', 
        'This old password is not correct!'),
    pwdHashRevisionFailed: viewUnit( 'failed', 'pwdManage', 'simple', 'old_password', 
        'This old password is not correct!'),
    pwdHashRevisionError: viewUnit('failed', 'pwdManage', 'none', '', 
        'System error occured!'),
    pwdHashingFailed:  viewUnit('failed', 'pwdManage', 'none', '', 
        'System error occured!'),
    pwdUpdateSuccess: viewUnit( 'success', 'pwdManage', 'none', '', 
            'Updating done!'),
    pwdUpdateFailed: viewUnit('failed', 'pwdManage', 'nonte', '',
        'Updating failed!'),

    // profile delete
    profDelsuccess: viewUnit('success', 'delAccount', 'none', '',
             'Deletion done!'),
    profDelFailed: viewUnit('failed', 'delAccount', 'none', '',
        'Deletion failed!'),
}


module.exports.forTodos = {
    // todo creation
    todoVerifyFailed(problemKeyWord) {
        return viewUnit('failed', 'newTodo', 'simple', problemKeyWord, 
            `This ${problemKeyWord} is not permitted!`)
    },
    todoCreationSuccess(dbmsg){
        return viewUnit('success', 'newTodo', 'object', dbmsg, 
            'Creation done!');
    },
    todoCreationFailed: viewUnit('failed', 'newTodo', 'none', '', 
        'Creation failed!'),


    // todo status/notation change
    todoStatusChangeVerifyFailed: viewUnit('failed', 'todoChange', 'simple',
        'status', 'System error occured!'),


    todoNotationChangeVerifyFailed: viewUnit('failed', 'todoChange', 'simple',
        'notation', 'System error occured!'),

    todoUpdateSuccess(dbmsg){
        return viewUnit('success', 'todoChange', 'date', dbmsg, 
            'Update done!')
    },
    todoUpdateFailed: viewUnit('failed', 'todoChange', 'none', '',
        'Update failed!'),


    todoRemoveSuccess: viewUnit('success', 'removeTodo', 'none', '',
        'Deletion done!'),
    todoRemoveFailed: viewUnit('failed', 'removeTodo', 'none', '',
        'Deletion failed!')
}

module.exports.forError = viewUnit('failed', 'general', 'none',
    'System error ovvured!')