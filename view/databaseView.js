module.exports = {

    assembleProperJSONContent: function(properContent){
        return JSON.stringify({
            status: 'success',
            report: properContent
        })
    },
    asembleNoContentJSONMsg: function(){
        return JSON.stringify({
            status: 'success',
            report: 'No content to show!'
        })
    },
    assembleDBErrorJSONMsg: function(){
        return JSON.stringify({
            status: 'failed',
            report: 'DB error occured!'
        })
    },

    showSystemMsg_isItOccured: function( isItSuccess, systemContent){
        return {
            status: isItSuccess? 'success': 'failed',
            report: systemContent
        }
    },
    
    // Common Profile messges
    profilePwdUpdateMsg: 'Password successfully changed!',
    profileDeletedMsg:  'User successfully deleted!'

    

}