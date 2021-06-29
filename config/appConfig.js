const db = require('./connectConfig')

module.exports.server = {
  port: 8080
}
module.exports.db = {
  db_access_cloud: db.db_access_cloud,
  db_access_local: db.db_access_local
}
module.exports.validation = {
  encryption_saltrounds: 12,
  actPwdLengthStandard : 60,
  username_regexp: '^[a-zA-Z0-9_.]{4,40}$',
  password: [4, 40],
  mongodbid_regexp: '^[0-9a-f]{24}$',
  true_false_regexp: '^true$|^false$',

  // defined in primitive values
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

