var mongo = require('mongoose')
var schema = mongo.Schema
var comment = new schema({
    Author : {
        type : mongo.Schema.Types.ObjectId,
        ref : 'User'
    },
    Comment : {
        type :String,
        required:true
    }
})
var post = new schema( {
    title : {
        type:String,
        required:true
    },
    Author : {
        type:mongo.Schema.Types.ObjectId,
        ref:'User'
    },
    Description : {
        type:String,
        required:true
    }
    ,
    // like : {
    //     type:String,
    //     required:true
    // },
    comment : [
        comment
    ]
    // image : {
    //     type:String,
    //     required:true
    // }
},
    {timeStamp : true}
)

module.exports = mongo.model('Post',post)