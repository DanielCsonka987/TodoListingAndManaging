module.exports.readAllMock = {
    corResp: {
        status: 'success',
        report: [
            {
                username: 'JohnD',
                loginUrl: '/profile/...1'
            },
            {
                username: 'JaneDoe',
                loginUrl: '/profile/...2'
            }
        ],
        message: 'Reading done!'
    },
    incorResp404:{
        status: 404, 
        text: 'No such content'
    },
    incorResp400:{
        status: 400,
        json: JSON.stringify({
            status: 'failed',
            report: '',
            message: 'Please login!'
        })
    },
    incorResp500:{
        status: 500,
        json: JSON.stringify({
            status: 'failed',
            report: '',
            message: 'DB process error!'
        })
    }
}