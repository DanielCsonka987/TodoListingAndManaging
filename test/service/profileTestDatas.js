module.exports.registGoodProfile = {
  'username': 'meHere',
  'password': 'pwdText',
  'password_repeat': 'pwdText',
  'first_name': 'meHereAgain',
  'last_name': 'MrSomebody',
  'age': 31,
  'occupation': 'stranger'
}

module.exports.registFaultyProfiles = [
  {
    'password': 'pwdText',
    'password_repeat': 'pwdText',
    'first_name': 'meHereAgain'
  },
  {
    'username': 'meHere',
    'first_name': 'meHereAgain'
  },
  {
    'username': 'meHere',
    'password': 'pwdText',
    'first_name': 'meHereAgain'
  },
  {
    'username': 'meHere',
    'password': 'pwdText',
    'password_repeat': 'pwdText',
  },
  {
    'username': 'me',
    'password': 'pwdText',
    'password_repeat': 'pwdText',
    'first_name': 'meHereAgain'
  },
  {
    'username': 'meHere',
    'password': 'pwdText',
    'password_repeat': 'pwdText1',
    'first_name': 'meHereAgain'
  }
]
