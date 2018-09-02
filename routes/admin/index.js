let router = require('express').Router();
const faker = require('faker');
const Post = require('../../models/Posts');
// over-ridding the default layout
router.all('/*',(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {
    res.render('admin/index');
    // res.send('hellowworld');
});
router.get('/dashboard',(req,res) => {
    res.render('admin/dashboard');
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
        post.save();

        
    }
    req.flash('success_fake_message',`${fake} fake post was created sucessfully`);
    res.redirect('/admin/posts')
})

module.exports = router;