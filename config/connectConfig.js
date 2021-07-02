const dbname = process.env.DB_NM || process.argv[2];
const dbUser = process.env.DB_UN || process.argv[3];
const dbPwd =  process.env.DB_PWD || process.argv[4];
module.exports = {
    db_access_cloud: 'mongodb+srv://' + dbUser + ':' + dbPwd +
     '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true'+
     '&w=majority',
    db_access_local: 'mongodb://127.0.0.1:27017/'+ dbname,
}
