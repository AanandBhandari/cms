const router = require('express').Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStragety = require('passport-local').Strategy;

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
// here,while passport.authenticate is being executed 
// this middleware,..email and password is taken from req.body nd by default usernamefield is username
// bt in our app we use email so we need to change it to email 
passport.use(new LocalStragety({usernameField:'email'},(email,password,done) => {
    // console.log(password)
    // finding the user
    User.findOne({ email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            // false because there is no user
          return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password,user.password,(err,matched) => {
            if(err) return err;
            if (matched) {
                return done(null,user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        })
      });
}));

passport.serializeUser(function(user, done) {
    
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
router.post('/login',(req,res,next) => {
   passport.authenticate('local',{
       successRedirect : '/admin',
       failureRedirect : '/login',
       failureFlash : true
   })(req,res,next);
});
router.get('/logout',(req,res) => {
    req.logOut();
    res.redirect('/login');
});
router.get('/register',(req,res) => {
    res.render('home/register');
    // res.send('hellowworld');
});
router.post('/register',(req,res) => {
    let errors = [];
    if (!req.body.firstName) {
        errors.push({message : 'please provide first-name'});
    } 
    if (!req.body.lastName) {
        errors.push({message : 'please provide last-name'});
    } 
    if (!req.body.email) {
        errors.push({message : 'please provide email'});
    } 
    if (!req.body.password) {
        errors.push({message : 'please provide password'});
    } 
    if (!req.body.passwordConfirm) {
        errors.push({message : 'please confirm the password'});
    } 
    if (req.body.password !== req.body.passwordConfirm) {
        errors.push({message : 'Password do not match!'});
    } 
    if (errors.length>0) {
        let body = req.body;
        res.render('home/register',{errors,body})
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
router.get('/post/:slug',(req,res) => {
    Post.findOne({slug : req.params.slug}).populate({path : 'comments', match:{approveComment:true}, populate : {path : 'user', model :'User'}})
    .populate('user')
    .then(post => {
        // res.render('home/post',{post});
        // console.log(post)
        Category.find({}).then(categories => {
            res.render('home/post',{post,categories});
        });
    }).catch(e => {
        res.status(400).send();
    });
    
    // res.send('hellowworld');
});
module.exports = router;