let router = require('express').Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const {isEmpty,uploadDir} = require('../../helpers/upload-testFile');
const fs = require('fs');
const path = require('path');
const {userAuthenticated} = require('../../helpers/authentication');

// over-ridding the default layout
router.all('/*',(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {
    Post.find({}).populate('category').then(posts => {
        res.render('admin/posts',{posts});
    }).catch(e => res.status(400).send());
    
    
});

router.get('/create',(req,res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create',{categories});
    }).catch(e => res.status(400).send());
   
});
router.post('/create',(req,res) => {
    // console.log(isEmpty(req.files));
    let filename = 'medium.jpg';
    if (!isEmpty(req.files)) {
        let file = req.files.file;
        filename = Date.now()+'--'+file.name;
        file.mv('./public/uploads/' +filename,(err)=> {
            if(err) throw err;
        });
    }


    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    // checkiing for validation and pushing error on error array
    let error = [];
    if (!req.body.title) {
        error.push({message : 'please provide title'});
    } 
    if (!req.body.body) {
        error.push({message : 'please provide description'});
    } 
    if (error.length>0) {
        res.render('admin/posts/create',{error})
    } else {
        const newPost = new Post({
            user : req.user.id,
            title : req.body.title,
            status : req.body.status,
            allowComments,
            body : req.body.body,
            category : req.body.category,
            file:filename
        });
        newPost.save().then(savedPost => {
            // setting up flash message
            req.flash('success_message',`Post ${savedPost.title} was created sucessfully`);
            res.redirect('/admin/posts')
        }).catch(e => console.log('unable to save'));
    }

 });

 router.get('/edit/:id',(req,res) => {
     Post.findOne({_id:req.params.id})
     .then((post => {
        Category.find({}).then(categories => {
            res.render('admin/posts/edit',{post,categories});
        })
         
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
        post.user = req.user.id;    
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            filename = Date.now()+'--'+file.name;
            post.file = filename;
            file.mv('./public/uploads/' +filename,(err)=> {
                if(err) throw err;
            });
        }
        post.save().then((updatedPost) => {
            req.flash('success_edit_message',`Post ${updatedPost.title} was edited sucessfully`);
            res.redirect('/admin/posts');
        })
    })).catch(e => res.status(400).send());
 });

//  deleting
router.delete('/:id',(req,res) => {
    Post.findOne({_id: req.params.id}).populate('comments')
    .then(post => {
        fs.unlink(uploadDir + post.file,(err) => {
            if (!post.comments.length<1) {
                post.comments.forEach(comment => {
                    comment.remove();
                });
            }
            post.remove(); 
            req.flash('success_delete_message',`Post ${post.title} was deleted sucessfully`);
            res.redirect('/admin/posts');
        });
        
    })
    .catch(e => res.status(400).send());
})
module.exports = router;