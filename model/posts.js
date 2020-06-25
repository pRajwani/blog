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
/*var likeSchema = new schema({
    likeAuthor :
})*/

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
    Comments : [commentSchema],
    likes : [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    image : {
       type:String
    },
    Category: {
        type: String,
        required: true
    },
    View: {
        type: Number,
        default: 0
    }

},
    {timestamps : true}
)

var post = mongoose.model('Post', postSchema);

module.exports = post;