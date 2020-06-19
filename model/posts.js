var mongoose = require('mongoose')
var schema = mongoose.Schema

var commentSchema = new schema({
    commentAuthor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    Comment : {
        type :String,
        required:true
    }
})

var postSchema = new schema({
    Title : {
        type:String,
        required:true
    },
    postAuthor : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Description : {
        type:String,
        required:true
    },
    Comments : [commentSchema]
    // like : {
    //     type:String,
    //     required:true
    // },
    // image : {
    //     type:String,
    //     required:true
    // }
},
    {timeStamp : true}
)

var post = mongoose.model('Post', postSchema);

module.exports = post;