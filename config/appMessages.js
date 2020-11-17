module.exports.front_error_messages = {
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
}
module.exports.front_success_messages = {
  //models/daos
  read: 'Reading done!',
  create: 'Creation done!',
  update: 'Updating done!',
  delete: 'Deletion done!',

  login: 'You are logged in!',
  logout: 'You logged out!'

}
