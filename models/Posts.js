const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const PostSchema = mongoose.Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
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
    },
    file : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now()
    },
    slug :{
        type : String
    },
    comments : [{
        type : Schema.Types.ObjectId,
        ref : 'comments'
    }]
},{usePushEach : true});
// slug is needed bcoz title may be the same nd to use title instead of id in the url
// here 1st parameter is title bcoz we gonna pull from it
// and the 2 parameter is where we gonna modify i.e slug
PostSchema.plugin(URLSlugs('title',{field :'slug'}));
module.exports = mongoose.model('posts',PostSchema);