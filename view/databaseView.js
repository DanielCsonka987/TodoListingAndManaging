const paths = require('../config/appConfig').routing

module.exports = {

    assembleProperMsgContent: function(properContent){
        return {
            status: 'success',
            report: properContent,
            message: ''
        }
    },
    asembleNoContentMsg: function(){
        return {
            status: 'success',
            report: 'No content to show!',
            message: ''
        }
    },
    assembleDBErrorMsg: function(){
        return {
            status: 'failed',
            report: 'DB error occured!',
            message: ''
        }
    },

    showSystemMsg_isItOccured: function( isItSuccess, systemContent){
        return {
            status: isItSuccess? 'success': 'failed',
            report: systemContent,
            message: ''
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
            username: privProf.username,
            loginUrl: paths.basePath + privProf.id + paths.loginPostfix
        }
    },
    convertProfileDetailsToPublic: function(privProf){
        return{
            username: privProf.username, 
            first_name: privProf.first_name,
            last_name: privProf.last_name,
            age: privProf.age,
            occupation: privProf.occupation,
            todos: privProf.convertAllTodosToSendable(),

            changPwdDelAccUrl: paths.basePath + privProf._id.toString(),
            logoutUrl: paths.basePath + privProf._id.toString() + paths.logoutPostfix,
        }
    },
    convertTodoDetailsToPublic: function(profileId, privTodo){
        return {
            task: privTodo.task,
            priority: privTodo.priority,
            notation: privTodo.notation,
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