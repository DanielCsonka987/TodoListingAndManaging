module.exports = {
    testDBConnection: require('../config/appConfig').db.db_access_local,
    
    profShortURLRegexp: '^\/profile\/',
    todoShortURLRegexp: '^\/profile\/',
    todoLongURLRegexp: '^',

    profileIDPosInUrl: 2,
    todoIDPosInUrl: 4
}