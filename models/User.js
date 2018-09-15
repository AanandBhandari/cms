const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
     lastName: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now()
    },
    googleId : String,
    profilePic : String
});
module.exports = mongoose.model('User',UserSchema);