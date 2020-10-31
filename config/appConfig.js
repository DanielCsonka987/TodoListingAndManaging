let dbname = 'todositedb';
let dbUser = 'test_user001';
let dbPwd = 'mp6jh2p0doKKiohH';

module.exports = {
  dbaccess: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority',

  encryption_saltrounds: 10,
  password_regexp: '^[0-9a-zA-Z]{4,40}$',
  mongodbid_regexp: '[0-9a-f]{12}',

  cookieLifetime: 900000,   //15 min

  common_apiHeader: {

  }
}




//full url durring the testing phase - using easily the MongoAtlas app
//'mongodb+srv://test_user001:mp6jh2p0doKKiohH@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority'
