let router = require('express').Router();
const Post = require('../../models/Posts');

// over-ridding the default layout
router.all('/*',(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {
    Post.find({}).then(posts => {
        res.render('admin/posts',{posts});
    }).catch(e => res.status(400).send());
    
    
});

router.get('/create',(req,res) => {
   res.render('admin/posts/create');
});
router.post('/create',(req,res) => {
    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    const newPost = new Post({
        title : req.body.title,
        status : req.body.status,
        allowComments,
        body : req.body.body
    });
    newPost.save().then(savedPost => {
        res.redirect('/admin/posts')
    }).catch(e => console.log('unable to save'));

 });

 router.get('/edit/:id',(req,res) => {
     Post.findOne({_id:req.params.id})
     .then((post => {
         res.render('admin/posts/edit',{post})
     })).catch(e => res.status(400).send());
 });

//  updating
 router.put('/edit/:id',(req,res) => {
    Post.findOne({_id:req.params.id})
    .then((post => {
        let allowComments = true;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.save().then((updatedPost) => {
            res.redirect('/admin/posts');
        })
    })).catch(e => res.status(400).send());
 });

//  deleting
router.delete('/:id',(req,res) => {
    Post.findOneAndRemove({_id: req.params.id})
    .then(post => {
        res.redirect('/admin/posts');
    })
    .catch(e => res.status(400).send());
})
module.exports = router;