let router = require('express').Router();
const Comment = require('../../models/Comments');
const Post = require('../../models/Posts');

router.post('/',(req,res) => {
    // res.send('helloworld')
    Post.findOne({_id : req.body.id}).then(post => {
        const newComment = new Comment({
            user : req.user,
            body : req.body.body
        });
        post.comments.push(newComment);
        post.save().then(savedPost => {
            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.id}`)
            })
        });
    }).catch(e => res.status(400).send());
});




module.exports = router;