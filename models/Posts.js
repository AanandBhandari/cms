const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    user : {

    },
    title : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : 'public'
    },
    allowComments : {
        type : Boolean,
        required :true
    },
    body : {
        type : String,
        required : true
    }
});
module.exports = mongoose.model('posts',PostSchema);