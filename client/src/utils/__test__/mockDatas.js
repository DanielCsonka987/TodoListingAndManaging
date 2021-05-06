module.exports.readAllMock = {
    corResp: Promise.resolve({
            status: 200,
            text: ()=>{
                return Promise.resolve(
                    JSON.stringify({
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
                    })
                )
            }                           
    }),

    incorResp404: Promise.reject({
        status: 404, 
        text: ()=>{
            'No such content'
        }
    }),
    incorResp400: Promise.reject({
        status: 400,
        text: ()=>{
            return Promise.resolve(
                JSON.stringify({
                    status: 'failed',
                    report: '',
                    message: 'Please login!'
                })
            )
        }

    }),
    incorResp500: Promise.reject({
        status: 500,
        text: ()=>{
            return Promise.resolve(
                JSON.stringify({
                    status: 'failed',
                    report: '',
                    message: 'DB process error!'
                })
            ) 
        }
        
    })
}

/*

                    {"status":"success","report":[{"username":"JohnD","loginUrl":"/profile/...1"},{"username":"JaneDoe","loginUrl":"/profile/...2"}],"message":"Reading done!"}







*/