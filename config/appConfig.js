const dbname = 'todositedb';
const dbUser = 'test_user001';
const dbPwd = 'R6KD4GlLKh362g8e';

module.exports.server = {
  port: 8080
}
module.exports.db = {
  db_access_cloud: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority',
  db_access_local: 'mongodb://127.0.0.1:27017/'+ dbname ,
}
module.exports.validation = {
  encryption_saltrounds: 12,
  actPwdLengthStandard : 60,
  username_regexp: '^[a-zA-Z0-9_.]{4,40}$',
  mongodbid_regexp: '[0-9a-f]{24}',
  true_false_regexp: '^true$|^false$',

  // defined in primitive values
  pwd_text_min: 4,
  pwd_text_max: 40,
  name_max: 80,
  occupation_max: 50,
  age_min: 5,
  age_max: 999,
  priority_min: 0,
  priority_max: 10,
  task_notation_max: 150
}
module.exports.routing = {
  basePath: '/profile/',
  registerPostfix: '/register',
  loginPostfix: '/login',
  logoutPostfix: '/logout',
  logRevisPostfix: '/revise',
  todoInterText: '/todo/',
  updateStatusPostfix: '/status',
  updateNotationPostfix: '/notation'
}
module.exports.cookie = {
  sessionCookiePrefix: '',
  sessionCookieNameing: 'session',
  path: '/profile/',
  cookieLifetime: 900000,   //15 min
  cookieHTTPOnly: true,
  cookieSecure: true,
  cookieSameSite: 'lax'
}

module.exports.headers = [
    ['Content-Type','application/json; charset=utf-8']
]





//full url durring the testing phase - using easily the MongoAtlas app
//'mongodb+srv://test_user001:mp6jh2p0doKKiohH@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority'
// mongodb+srv://test_user001:R6KD4GlLKh362g8e@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority
