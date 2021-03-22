const { model, Schema} = require('mongoose');
const TodoItemSchema = require('./TodoSchema')
const view = require('../view/databaseView')

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
ProfileItemSchema.virtual('publicDatas').get(function(){
  return { 
    id: this._id, 
    username: this.username 
  }
})
// after login, the needed contents
ProfileItemSchema.virtual('privateDatas').get(function(){
  return {
    id: this._id, 
    username: this.username, 
    first_name: this.first_name,
    last_name: this.last_name,
    age: this.age,
    occupation: this.occupation,
    todos: this.todos
  }
})
// at profile validation
ProfileItemSchema.virtual('systemDatas').get(function(){
  return {
    id: this._id,
    username: this.username,
    pwdHash: this.password
  }
})



// Publish profile basics at front loading
ProfileItemSchema.statics.collectAllProfiles = function(callbFunc){
  return this.find({}, (err, docs)=>{
    if(err) { 
      callbFunc(view.assembleDBErrorJSONMsg());
    }else{
      const res = docs.map(item=> item.publicDatas);
      callbFunc(
        res.length === 0? view.asembleNoContentJSONMsg() :
        view.assembleProperJSONContent(res)
      )
    }
  })
}
// Login process finishing step
ProfileItemSchema.statics.findThisProfileToLogin = function(id, callbFunc){
  return this.findOne({ _id: id }, (err, doc)=>{
    callbFunc( 
      err? view.assembleDBErrorJSONMsg() :
        view.assembleProperJSONContent(doc.privateDatas)
    )
  })
}

// Profile existence measure, username collision measure
ProfileItemSchema.statics.findThisById = function(id, callbFunc){
  return this.findOne({ _id: id }, (err, doc)=>{
    callbFunc( (err || !doc)?
      view.showSystemMsg_isItOccured(false, '') :
      view.showSystemMsg_isItOccured(true, doc.systemDatas)
    )
  })
}
ProfileItemSchema.statics.findThisByUsername = function(uName, callbFunc){
  return this.findOne({ username: uName}, (err, doc)=>{
    callbFunc( (err || !doc)?
      view.showSystemMsg_isItOccured(false, '') :
      view.showSystemMsg_isItOccured(true, doc.systemDatas)
    )
  });
}




// Profile manipulation processes
ProfileItemSchema.statics.createNewProfile = function(profDatas, callbFunc){
  return this.create(profDatas, (err, doc)=>{
    callbFunc( (err || !doc)?
      view.assembleDBErrorJSONMsg() :
      view.assembleProperJSONContent(doc.privateDatas)
    )
  })
}

ProfileItemSchema.statics.changePwdInProfile = function(id, newPwdHash, callbFunc){
  return this.updateOne({ _id: id}, {password: newPwdHash }, (err, res)=>{
    callbFunc( (err || res.nModified !== 1)? 
      view.assembleDBErrorJSONMsg() :
      view.assembleProperJSONContent( view.profilePwdUpdateMsg )
    )
  })
}
ProfileItemSchema.statics.removeThisProfile = function(id, callbFunc){
  return this.deleteOne({_id: id}, (err, res)=>{
    callbFunc( (err || res.deletedCount !== 1)?
      view.assembleDBErrorJSONMsg() :
      view.assembleProperJSONContent( view.profileDeletedMsg )
    )
  })
}



ProfileItemSchema.static.addNewTodo = function(id, todoid, callbFunc){

}

ProfileItemSchema.statics.modifyTodoNotation = function(id, todoid, newNote, callbFunc){

}

ProfileItemSchema.statics.modifyTodoStatus = function(id, todoid, newStatus, callbFunc){

}

ProfileItemSchema.static.removeThiTodo = function(id, todoid, callbFunc){

}

module.exports = model('profiles', ProfileItemSchema);
