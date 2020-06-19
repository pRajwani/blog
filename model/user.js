var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var schema = mongoose.Schema

var userSchema = new schema({
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
userSchema.plugin(passportLocalMongoose);

var user = mongoose.model('User', userSchema);
module.exports = user;
