let router = require('express').Router();
const Comment = require('../../models/Comments');
const Post = require('../../models/Posts');
const {userAuthenticated} = require('../../helpers/authentication');

// over-ridding the default layout
router.all('/*',userAuthenticated,(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
});

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
                req.flash('success_message',`Your comment will reviewed in a moment :)`);
                res.redirect(`/post/${post.id}`)
            })
        });
    }).catch(e => res.status(400).send());
});

router.get('/',(req,res) => {
    Comment.find({user : req.user.id}).populate('user').then(comments => {
        res.render('admin/comments/index',{comments})
    }).catch(e => {
        console.log(e)
        res.status(400).send()
    });
    
});
router.delete('/:id',(req,res) => {
    // console.log(req.params.id)
    Comment.findOneAndRemove({_id : req.params.id}).then((commentRemoved => {
        Post.findOneAndUpdate({comments: req.params.id},{$pull:{comments:req.params.id}},(err,data) => {
            if(err) console.log(err);
            res.redirect('/admin/comments');
        })
        
    })).catch(e => res.status(400).send());

});
 router.post('/approve-comment',(req,res) => {
    //  console.log(req.body.approveComment)
    Comment.findByIdAndUpdate(req.body.id,{$set : {approveComment:req.body.approveComment}},(err,data) => {
        if (err) {
            return err;
        }
        res.send(data);
    });
 });


module.exports = router;