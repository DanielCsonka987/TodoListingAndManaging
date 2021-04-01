const { model, Schema } = require('mongoose');
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



// VIRTUAL METHODS

// generally before login, public content
ProfileItemSchema.virtual('basicProfileDatas').get(function(){
  return view.convertProfileBasisToPublic(this)  
})
// after login, the needed contents
ProfileItemSchema.virtual('detailedProfileDatas').get(function(){
  return view.convertProfileDetailsToPublic(this)
})
// at profile validation
ProfileItemSchema.virtual('systemDatas').get(function(){
  return view.convertProfileMinimumToSystem(this)
})
// for testing purpose
ProfileItemSchema.virtual('forTestShowFirstTodo').get(function(){
  return this.todos[0]
})



// INSTANCE METHODS //

// todo methods
ProfileItemSchema.methods.convertAllTodosToSendable = function(){
  const profileId = this._id;
  return this.todos.map(item => view.convertTodoDetailsToPublic(profileId, item))
}
ProfileItemSchema.methods.findThisBrandNewTodo = function(todoItem){
  return this.todos.filter(todo => todo.task === todoItem.task )[0]
}
ProfileItemSchema.methods.findThisRawTodo = function(todoid){
  return this.todos.filter(todo=> todo._id.equals(todoid) )[0]
}
ProfileItemSchema.methods.deleteThisTodoFromArray = function(todoid){
  this.todos = this.todos.filter(todo => !todo._id.equals(todoid))
}


// STATIC METHODS //

// Publish profile basics at front loading
ProfileItemSchema.statics.collectAllProfiles = function(callbFunc){
  return this.find({}, (err, docs)=>{
    if(err) { 
      callbFunc(view.assembleDBErrorMsg());
    }else{
      const res = docs.map(item=> item.basicProfileDatas);
      callbFunc(
        res.length === 0? view.asembleNoContentMsg() :
        view.assembleProperMsgContent(res)
      )
    }
  })
}
// Login process finishing step
ProfileItemSchema.statics.findThisProfileToLogin = function(profid, callbFunc){
  return this.findOne({ _id: profid }, (err, doc)=>{
    callbFunc( 
      err? view.assembleDBErrorMsg() :
        view.assembleProperMsgContent(doc.detailedProfileDatas)
    )
  })
}

// Profile existence measure, username collision measure
ProfileItemSchema.statics.findThisById = function(profid, callbFunc){
  return this.findOne({ _id: profid }, (err, doc)=>{
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
      view.assembleDBErrorMsg() :
      view.assembleProperMsgContent(doc.detailedProfileDatas)
    )
  })
}
ProfileItemSchema.statics.changePwdInProfile = function(profid, newPwdHash, callbFunc){
  return this.updateOne({ _id: profid}, {password: newPwdHash }, (err, res)=>{
    callbFunc( (err || res.nModified !== 1)? 
      view.assembleDBErrorMsg() :
      view.assembleProperMsgContent('')
    )
  })   
}
ProfileItemSchema.statics.removeThisProfile = function(profid, callbFunc){
  return this.deleteOne({_id: profid}, (err, res)=>{
    callbFunc( (err || res.deletedCount !== 1)?
      view.assembleDBErrorMsg() :
      view.assembleProperMsgContent('')
    )
  })
}



// Todo managing
ProfileItemSchema.statics.addNewTodo = function(profid, todoCont, callbFunc){
  return this.findOne({_id: profid}, (err, doc)=>{
    if(err || !doc){
      callbFunc(view.assembleDBErrorMsg())
    }else{
      try{
        doc.todos.push(todoCont)
        doc.save();
        const newTodoItself = doc.findThisBrandNewTodo(todoCont)
        const publicTodo = view.convertTodoDetailsToPublic(doc._id, newTodoItself)
        callbFunc(view.assembleProperMsgContent(publicTodo))
      }catch(e){
        callbFunc(view.assembleDBErrorMsg())
      }
    }
  })
}
ProfileItemSchema.statics.modifyTodoNotation = function(profid, todoid, newNote, callbFunc){
  return this.findOne({ _id: profid}, (err, doc)=>{
    if(err || !doc){
      callbFunc(view.assembleDBErrorMsg())
    }else{
      try{
        const newDate = new Date();
        doc.findThisRawTodo(todoid).changeTodoNote(newNote, newDate.toISOString());
        doc.save();
        callbFunc(view.assembleProperMsgContent(newDate))
      }catch(e){
        callbFunc(view.assembleDBErrorMsg())
      }
    }
  })
}
ProfileItemSchema.statics.modifyTodoStatus = function(profid, todoid, newStatus, callbFunc){
  return this.findOne({ _id: profid}, (err, doc)=>{
    if(err || !doc){
      callbFunc(view.assembleDBErrorMsg())
    }else{
      try{
        const newDate = new Date();
        doc.findThisRawTodo(todoid).changeTodoStatus(newStatus, newDate.toISOString());
        doc.save();
        callbFunc(view.assembleProperMsgContent(newDate))
      }catch(e){
        callbFunc(view.assembleDBErrorMsg())
      }
    }
  })
}
ProfileItemSchema.statics.removeThisTodo = function(profid, todoid, callbFunc){
  return this.findOne({ _id: profid }, (err, doc)=>{
    if(err || !doc){
      callbFunc(view.assembleDBErrorMsg())
    }else{
      try{
        doc.deleteThisTodoFromArray(todoid)
        doc.save();
        callbFunc( view.assembleProperMsgContent('') )
      }catch(e){
        callbFunc(view.assembleDBErrorMsg())
      }
    }
  })
}

module.exports = model('profiles', ProfileItemSchema);
