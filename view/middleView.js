
// COOKIE MESSAGES //
module.exports.forCookies = {
    generalProblemMsg: {
        status: 'failed',
        report: '',
        message: 'Please, log in to use such service!'
    },

    paramMissmatchMsg: {
        status: 'failed',
        report: '',
        message: 'Management is permitted only at your account!'
    },
    loggedInStateMsg(state){
        return {
            status: state? 'success' : 'failed',
            report: '',
            message: state? 'You are still logged in!'
                : 'No login state!',
        }
    },
    systemError: {
        status: 'failed',
        report: '',
        message: 'System error occured!'
    }
}

// LOGIN MESSAGES //
module.exports.forLogin = {
    noProperLoginDatas: {
        status: 'failed',
        report: 'dataFail',
        message: 'Wrong username or password!'
    },
    noSuchUserInSystem: {
        status: 'failed',
        report: 'lackOfUser',
        message: 'Wrong username or password!'
    },
    differentParamAndUserid: {
        status: 'failed',
        report: 'differentParams',
        message: 'Wrong username or password!'
    },
    passwordNotAcceptable: {
        status: 'failed',
        report: 'authentication',
        message: 'Wrong username or password!'
    },
    passwordTestError: {
        status: 'failed',
        report: 'authentication',
        message: 'System error occured!'
    },
    loginSuccess: (dbmsg) =>{
        dbmsg.message = 'You have logged in!';
        return  dbmsg
    },
    loginFail: (dbmsg) =>{
        dbmsg.message = 'System error occured!';
        return dbmsg
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
        dbmsg.message = 'System error occured!';
        return dbmsg
    },
    registerSuccess: (dbmsg)=>{
        dbmsg.message = 'Registration done!';
        return dbmsg
    }
}

module.exports.forProfiles = {
    // loading profile list
    readPublicProfilesFail: (dbmsg) =>{
        dbmsg.message = 'Reading error!';
        return dbmsg
    },
    readPublicProfilesSuccess(dbmsg){
        dbmsg.message = 'Reading done!';
        return dbmsg
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
    pwdHashRevisionFailed: {
        status: 'failed',
        report: 'old_password',
        msg: 'This old password is not correct!'
    },
    pwdHashRevisionError:{
        status: 'failed',
        report: '',
        message: 'System error occured!'
    },
    pwdHashingFailed: {
        status: 'failed',
        report: '',
        message: 'System error occured!'
    },
    pwdUpdateSuccess(dbmsg){
        dbmsg.message = 'Updating done!';
        return dbmsg
    },
    pwdUpdateFailed(dbmsg){
        dbmsg.message = 'Updating failed!';
        return dbmsg
    },

    // profile delete
    profDelsuccess(dbmsg){
        dbmsg.message = 'Deletion done!';
        return dbmsg
    },
    profDelFailed(dbmsg){
        dbmsg.messge = 'Deletion failed!';
        return dbmsg
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
        dbmsg.message = 'Creation done!';
        return dbmsg;
    },
    todoCreationFailed(dbmsg){
        dbmsg.message = 'Creation failed!';
        return dbmsg
    },


    // todo status change
    todoStatusChangeVerifyFailed: {
        status: 'failed',
        report: 'status',
        message: 'System error occured!'
    },
    todoUpdateSuccess(dbmsg){
        dbmsg.message = 'Update done!';
        return dbmsg
    },
    todoUpdateFailed(dbmsg){
        dbmsg.message = 'Update failed!';
        return dbmsg
    },


    todoRemoveSuccess(dbmsg) {
        dbmsg.message = 'Deletion done!';
        return dbmsg
    },
    todoRemoveFailed(dbmsg){
        dbmsg.message = 'Deletion failed!';
        return dbmsg;
    }

}

module.exports.forError = {
    status:'failed',
    report: 'Geneal error occured!',
    message: 'System error ovvured!'
}