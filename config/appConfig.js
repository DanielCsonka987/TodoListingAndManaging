module.exports = {
  dbaccess: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority'
}

let dbname = 'todositedb';
let dbUser = 'test_user001';
let dbPwd = 'mp6jh2p0doKKiohH';


//full url durring the testing phase - using easily the MongoAtlas app
//'mongodb+srv://test_user001:mp6jh2p0doKKiohH@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority'
