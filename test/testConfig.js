module.exports = {
    testDBConnection: require('../config/appConfig').db.db_access_local,
    headerArrayToTest: require('../config/appConfig').headers,

    profURLRegexp:{
        loadProfiles: '^\/profile\/$',
        loginProf: '^\/profile\/[0-9a-f]{24}\/login$',
        logoutProf: '^\/profile\/[0-9a-f]{24}\/logout$',
        changePwdRemoveProf: '^\/profile\/[0-9a-f]{24}$',
        //registerProf: '^\/profile\/register$',
        //logingReviseURLRegexp: '^\/profile\/revise$'
    },
    todoURLRegexp: {
        createNew: '^\/profile\/[0-9a-f]{24}\/todo\/$',
        changeNote: '^\/profile\/[0-9a-f]{24}\/todo\/[0-9a-f]{24}\/notation$',
        changeStatus: '^\/profile\/[0-9a-f]{24}\/todo\/[0-9a-f]{24}\/status$',
        remove: '^\/profile\/[0-9a-f]{24}\/todo\/[0-9a-f]{24}$'
    },

    profileIDPosInUrl: 2,
    todoIDPosInUrl: 4
}