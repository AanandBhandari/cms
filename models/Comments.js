const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = mongoose.Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    body : {
        type : String,
        required : true
    },
    approveComment : {
        type : Boolean,
        default : false
    }
});
module.exports = mongoose.model('comments',CommentSchema);