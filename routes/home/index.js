const router = require('express').Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');

router.all('/*',(req,res,next) => {
    req.app.locals.layout ='home';
    next();
});


router.get('/',(req,res) => {
    
    Post.find({}).then((posts) => {
        Category.find({}).then(categories => {
            res.render('home/index',{posts,categories});
        });
        
    }).catch(e => {
        res.status(400).send();
    });
    // res.send('hellowworld');
});
router.get('/about',(req,res) => {
    res.render('home/about');
    // res.send('hellowworld');
});
router.get('/login',(req,res) => {
    res.render('home/login');
    // res.send('hellowworld');
});
router.get('/register',(req,res) => {
    res.render('home/register');
    // res.send('hellowworld');
});
router.get('/post/:id',(req,res) => {
    Post.findOne({_id : req.params.id}).then(post => {
        // res.render('home/post',{post});
        Category.find({}).then(categories => {
            res.render('home/post',{post,categories});
        });
    }).catch(e => {
        res.status(400).send();
    });
    
    // res.send('hellowworld');
});
module.exports = router;