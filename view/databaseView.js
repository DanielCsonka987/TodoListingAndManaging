const paths = require('../config/appConfig').routing

module.exports = {

    assembleProperMsgContent: function(properContent){
        return {
            status: 'success',
            report: properContent
        }
    },
    asembleNoContentMsg: function(){
        return {
            status: 'success',
            report: 'No content to show!'
        }
    },
    assembleDBErrorMsg: function(){
        return {
            status: 'failed',
            report: 'DB error occured!'
        }
    },

    showSystemMsg_isItOccured: function( isItSuccess, systemContent){
        return {
            status: isItSuccess? 'success': 'failed',
            report: systemContent
        }
    },



    convertProfileMinimumToSystem(privProf){
        return  {
            id: privProf._id,
            username: privProf.username,
            pwdHash: privProf.password,
        }
    },
    convertProfileBasisToPublic(privProf){
        return {
            id: privProf._id,
            username: privProf.username,
            loginUrl: paths.basePath + privProf.id + paths.loginPostfix
        }
    },
    convertProfileDetailsToLogin: function(privProf){
        return{
            id: privProf._id,
            username: privProf.username, 
            fullname: privProf.first_name + ' ' + privProf.last_name,
            age: privProf.age,
            occupation: privProf.occupation,
            todos: privProf.convertAllTodosToSendable(),

            createNewTodo: paths.basePath + privProf._id.toString() + paths.todoInterText,
            changePwdDelAccUrl: paths.basePath + privProf._id.toString(),
            logoutUrl: paths.basePath + privProf._id.toString() + paths.logoutPostfix
        }
    },
    convertProfileDetailsToRegister: function(privProf){
        let datas = this.convertProfileDetailsToLogin(privProf)
        datas.loginRegUrl = paths.basePath + privProf.id + paths.loginPostfix;
        return datas
    },
    convertTodoDetailsToPublic: function(profileId, privTodo){
        return {
            id: privTodo._id,
            task: privTodo.task,
            priority: privTodo.priority,
            notation: privTodo.notation || '',
            status: privTodo.status,
            start: privTodo.startingDate,
            update: privTodo.lastModfingDate,

            notationChangeUrl: paths.basePath + profileId + paths.todoInterText
                + privTodo._id.toString() + paths.updateNotationPostfix,

            statusChangeUrl: paths.basePath + profileId + paths.todoInterText
                + privTodo._id.toString() + paths.updateStatusPostfix,

            removingUrl: paths.basePath + profileId + paths.todoInterText
                + privTodo._id.toString()
        }
    }
}