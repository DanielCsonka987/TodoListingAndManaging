let dbname = 'todositedb';
let dbUser = 'test_user001';
let dbPwd = 'mp6jh2p0doKKiohH';

module.exports = {
  db_access: 'mongodb+srv://' + dbUser + ':' + dbPwd +
   '@cluster0.rols0.mongodb.net/' + dbname + '?retryWrites=true&w=majority',

  validation_config: {
    encryption_saltrounds: 12,
    password_regexp: '^[0-9a-zA-Z]{4,40}$',
    mongodbid_regexp: '[0-9a-f]{24}',
    true_false_regexp: '^true$|^false$',
  },

  routing_paths: {
    api_base: '/api',
    api_base_profile: '/api/prof',

    api_login: '/login',
    api_logout: '/logout',
    api_todo: '/todos',
    api_update_status: '/status',
    api_update_notation: '/notation'
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

  front_error_messages: {
    //models/daos
    model_read: 'Reading unfuccessful!',
    model_create: 'Creation unfuccessful!',
    model_update: 'Updating unfuccessful!',
    model_delete: 'Deletion unsuccessful!',

    //cookie middleware
    cookie_misses: 'Please, log in to use such service!',
    cookie_profile_mismatch: 'Management is permitted only at your account!',
    cookie_revision: 'Session cookie re-authentication is unsuccessful!',

    //profile password authentication (profile middle) - profile/todo steps
    password_new_old_mismatch: 'Wrong new password or original password!',
    password_update_revise: 'Wrong given password!',
    //profile password update and registering new user
    password_regOrUpdate_newHashing: 'Password encription error!',
    //only at login data authenticate
    password_login_validation: 'Wrong username or password!',

    //generally data validation
    authentication_unknown: 'Authentication error!',
    //only at registration
    register_username_occupied: 'This username is already in use!'
  },
  front_success_messages: {
    //models/daos
    read: 'Reading done!',
    create: 'Creation done!',
    update: 'Updating done!',
    deletion: 'Deletion done!',

    login: 'You are logged in!',
    logout: 'You logged out!'

  },

  common_apiHeader: [
    ['Content-Type','application/json']
  ]
}




//full url durring the testing phase - using easily the MongoAtlas app
//'mongodb+srv://test_user001:mp6jh2p0doKKiohH@cluster0.rols0.mongodb.net/todositedb?retryWrites=true&w=majority'
