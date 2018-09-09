let router = require('express').Router();
const faker = require('faker');
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const Comment = require('../../models/Comments');
const {userAuthenticated} = require('../../helpers/authentication');
// over-ridding the default layout
router.all('/*',userAuthenticated,(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {
    const promises = [
        Post.countDocuments().exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments().exec(),
    ] ;
    Promise.all(promises).then(([postCount,categoryCount,commentCount]) => {
        res.render('admin/index',{postCount,categoryCount,commentCount});
    });
    // Post.countDocuments({}).then(postCount => {
    //     res.render('admin/index',{postCount});
    // })
    
    // res.send('hellowworld');
});
router.get('/dashboard',(req,res) => {
    res.redirect('/admin');
    // console.log(req.session)
    // res.send('hellowworld');
});
router.post('/generate-fake-posts',(req,res) => {
    let fake = 0;
    for (let i = 0; i <req.body.amount; i++) {
        fake ++;
        let post = new Post();
        let filename = 'medium.jpg';
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.file =filename;
        post.slug = faker.name.title();
        post.save();

        
    }
    req.flash('success_fake_message',`${fake} fake post was created sucessfully`);
    res.redirect('/admin/posts')
})

module.exports = router;