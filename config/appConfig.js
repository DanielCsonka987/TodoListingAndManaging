let dbname = 'todositedb';
let dbUser = 'test_user001';
let dbPwd = 'mp6jh2p0doKKiohH';

module.exports = {
  db_access: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority',

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
