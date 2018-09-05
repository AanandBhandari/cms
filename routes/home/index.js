const router = require('express').Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

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
router.post('/register',(req,res) => {
    let error = [];
    if (!req.body.firstName) {
        error.push({message : 'please provide first-name'});
    } 
    if (!req.body.lastName) {
        error.push({message : 'please provide last-name'});
    } 
    if (!req.body.email) {
        error.push({message : 'please provide email'});
    } 
    if (!req.body.password) {
        error.push({message : 'please provide password'});
    } 
    if (!req.body.passwordConfirm) {
        error.push({message : 'please confirm the password'});
    } 
    if (req.body.password !== req.body.passwordConfirm) {
        error.push({message : 'Password do not match!'});
    } 
    if (error.length>0) {
        let body = req.body;
        res.render('home/register',{error,body})
    } else {
        User.findOne({email : req.body.email}).then(user => {
            if (!user) {
                const newUser = new User({
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    email : req.body.email,
                    password : req.body.password
                });
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        // console.log(hash);
                        newUser.password = hash;
                        newUser.save().then(savedUser => {
                            // res.send('user was saved');
                            req.flash('success_message','you are now registred, please login!');
                            res.redirect('/login')
                        })
                    });
                });
            } else {
                req.flash('error_message','Thats email is already taken, please login!');
                res.redirect('/login')
            }
        }).catch(e => {
            res.status(400).send();
        });
        
        
    // res.send('hellowworld');
}});
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