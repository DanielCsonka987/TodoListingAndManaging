const { model, Schema} = require('mongoose');
const TodoItemSchema = require('./TodoSchema')



const ProfileItemSchema = new Schema({
  first_name: {type: String, required: true, maxlength: 80},
  last_name: {type: String, maxlength: 80},
  username: {type: String, required: true, minlength: 4, maxlength: 70},
  password: {type: String, required: true, minlength: 4, maxlength: 60},
  age: {type: Number, min:5, max: 120, default: 18 },
  occupation: {type: String, maxlength: 50, default:'unknown'},
  todos: [ TodoItemSchema ]
});


// generally before login, public content
ProfileItemSchema.virtual('profileLessDetails').get(function(){
  return {}
})
// after login, the needed contents
ProfileItemSchema.virtual('profileMoreDetails').get(function(){
  return {}
})
// testing purpose
ProfileItemSchema.virtual('profileToString').get(function(){
  console.log(this)
})


// Reading processes detailing
ProfileItemSchema.query.byProfId = function(id){
  return this.where({ _id: id });
}

ProfileItemSchema.query.byUserName = function(uName){
  return this.where({ username: uName })
}



ProfileItemSchema.statics.collectAllProfiles = function(cb){
  return this.find({}, (err, docs)=>{
    cb(err? err : docs)
  })
}
// Screener methods
ProfileItemSchema.statics.findThisById = function(id, cb){
  return this.findOne({ _id: id }, (err, doc)=>{
    cb(err? err : doc ) 
  })
}

ProfileItemSchema.statics.findThisByUsername = function(uName, cb){
  return this.findOne({ username: uName}, (err, doc)=>{
    cb(err? err : doc ) 
  });
}




// Create, Delete processes
ProfileItemSchema.statics.createNewProfile = function(profDet){
  return this.create()
}

ProfileItemSchema.statics.removeThisProfile = function(id){

}


/*
ProfileItemSchema.static.addNewTodo = function(id, todoid){

}



ProfileItemSchema.static.removeThiTodo = function(id, todoid){

}
*/
module.exports = model('profiles', ProfileItemSchema);
