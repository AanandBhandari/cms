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
    }
});
module.exports = mongoose.model('comments',CommentSchema);