const dbname = 'todositedb';
const dbUser = 'test_user001';
const dbPwd = 'R6KD4GlLKh362g8e';

module.exports = {
  db_access_cloud: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority',
  db_access_local: 'mongodb://127.0.0.1:27017/'+ dbname ,

  validation_config: {
    encryption_saltrounds: 12,
    username_regexp: '^[a-zA-Z0-9_.]{4,40}$',
    mongodbid_regexp: '[0-9a-f]{24}',
    true_false_regexp: '^true$|^false$',
  },

  routing_paths: {
    basePath: '/api/',
    registerPostfix: '/register',
    loginPostfix: '/login',
    logoutPostfix: '/logout',
    logRevisPostfix: '/revise',
    todoPostfix: '/todos',
    updateStatusPostfix: '/status',
    updateNotationPostfix: '/notation'
  },
  cookie_details: {
    sessionCookiePrefix: '',
    sessionCookieNameing: 'session',
    path: '/api/',
    cookieLifetime: 900000,   //15 min
    cookieHTTPOnly: true,
    cookieSecure: true,
    cookieSameSite: 'lax'
  },

  common_apiHeader: [
    ['Content-Type','application/json']
  ]
}




//full url durring the testing phase - using easily the MongoAtlas app
//'mongodb+srv://test_user001:mp6jh2p0doKKiohH@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority'
// mongodb+srv://test_user001:R6KD4GlLKh362g8e@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority
