
// COOKIE MESSAGES //
module.exports.forCookies = {
    generalProblemMsg = {
        status: 'failed',
        report: '',
        message: 'Please, log in to use such service!'
    },

    paramMissmatchMsg = {
        status: 'failed',
        report: '',
        message: 'Management is permitted only at your account!'
    },
    loggedInStateMsg = (state)=>{
        return {
            status: state? 'success' : 'failed',
            report: '',
            message: state? 'You are still logged in!'
                : 'No login state!',
        }
    },
    systemError = {
        status: 'failed',
        report: '',
        message: 'System error occured!'
    }
}

// LOGIN MESSAGES //
module.exports.forLogin = {
    noProperLoginDatas: {
        status: 'falied',
        report: '',
        message: 'Wrong username or password!'
    },
    noSuchUserInSystem: {
        status: 'falied',
        report: '',
        message: 'Wrong username or password!'
    },
    differentParamAndUserid: {
        status: 'falied',
        report: '',
        message: 'Wrong username or password!'
    },
    passwordNotAcceptable: {
        status: 'falied',
        report: '',
        message: 'Wrong username or password!'
    },
    passwordTestError: {
        status: 'failed',
        report: 'password_test',
        message: 'System error occured!'
    },
    loginSuccess: (dbmsg) =>{
        return  dbmsg.message = 'You have logged in!'
    },
    loginFail: (dbmsg) =>{
        return dbmsg.message = 'System error occured!'
    }
}

module.exports.forLogout = {
    success: {
        status: 'success',
        report: '',
        message: 'You have logged out!'
    },
    falied: {
        status: 'failed',
        report: '',
        message: 'System error occured!'
    }
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
        return {
            status: 'failed',
            report: problemKeyWord,
            message: msg
        }
    },
    usernameOccupied: {
        status: 'failed',
        report: 'username',
        message: 'This username is already in use!'
    },
    registeringError: (type)=> {
        return {
            status: 'failed',
            report: type,
            message: 'System error occured!'
        }
    },
    regProfilePersistFail: (dbmsg)=>{
        return dbmsg.message = 'System error occured!'
    },
    registerSuccess: (dbmsg)=>{
        return dbmsg.message = 'Registration done!'
    }
}

module.exports.forProfiles = {
    // loading profile list
    readPublicProfilesFail: (dbmsg) =>{
        return dbmsg.message = 'Reading error!'
    },
    readPublicProfilesSuccess(dbmsg){
        return dbmsg.message = 'Reading done!'
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
        return {
            status: 'failed',
            report: problemKeyWord,
            message: msg
        }
    },

    // password change
    pwdHashRevisionFail: {
        status: 'failed',
        report: 'old_password',
        message: 'This old password is not correct!'
    },
    pwdHashRevisionError:{
        status: 'failed',
        report: '',
        message: 'System error occured!'
    },
    pwdHashFailed: {
        status: 'failed',
        report: '',
        msg: 'System error occured!'
    },
    pwdUpdateFailed(dbmsg){
        return dbmsg.message = 'Updating failed!'
    },
    pwdUpdateSuccess(dbmsg){
        return dbmsg.message = 'Updating done!'
    },

    // profile delete
    profDelsuccess(dbmsg){
        return dbmsg.message = 'Deletion done!'
    },
    profDelFailed(dbmsg){
        return dbmsg.messge = 'Deletion failed!'
    }
}


module.exports.forTodos = {
    // todo creation
    todoVerifyFailed(problemKeyWord) {
        return {
            status: 'failed',
            report: problemKeyWord,
            message: `This ${problemKeyWord} is not permitted!`
        }
    },
    todoCreationSuccess(dbmsg){
        return dbmsg.message = 'Creation done!'
    },
    todoCreationFailed(dbmsg){
        return dbmsg.message = 'Creation failed!'
    },


    // todo status change
    todoStatusChangeVerifyFailed: {
        status: 'failed',
        report: 'status',
        message: 'System error occured!'
    },
    todoUpdateSuccess(dbmsg){
        return dbmsg.message = 'Update done!'
    },
    todoUpdateFailed(dbmsg){
        return dbmsg.message = 'Update failed!'
    },


    todoRemoveSuccess(dbmsg) {
        return dbmsg.message = 'Deletion done!'
    },
    todoRemoveFailed(dbmsg){
        return dbmsg.message = 'Deletion failed!'
    }

}