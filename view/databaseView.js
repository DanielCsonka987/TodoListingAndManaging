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

    convertTodoPrivateToPublic: function(privTodo){
        return {
            id: privTodo._id,
            task: privTodo.task,
            priority: privTodo.priority,
            notation: privTodo.notation,
            status: privTodo.status,
            start: privTodo.startingDate,
            update: privTodo.lastModfingDate
        }
    }
}