var mongo = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
var schema = mongo.Schema
var user = new schema({
    name : {
        type : String,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    admin: 
    {
        type: Boolean,
        default:false
    }
})
user.plugin(passportLocalMongoose);
var registerUser = mongo.model('User',user)
module.exports = registerUser;