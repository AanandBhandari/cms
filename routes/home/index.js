const router = require('express').Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStragety = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../../config/googlauth');
const {userUnAuthenticated} = require('../../helpers/authentication');

router.all('/*',(req,res,next) => {
    req.app.locals.layout ='home';
    next();
});

router.get('/category/:name',(req,res) => {
    Category.findOne({name : req.params.name}).then((category) => {
        const perPage = 10;
        const page = req.query.page || 1;        
        Post.find({category:category._id})
        .populate('user')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then((posts) => {
            Post.countDocuments({category:category._id}).then(postCount => {
                if (postCount<1) {
                    Category.find({}).then(categories => {
                        res.render('home/index',{
                            Nopost: `There is no such post of category:- ${req.params.name} `,
                            categories
                        });
                    });
                } else{
                    Category.find({}).then(categories => {
                        res.render('home/index',{
                            posts,
                            categories,
                            current : parseInt(page),
                            pages : Math.ceil(postCount/perPage)
                        });
                    });

                }
               
            })
           
            
        }).catch(e => {
            res.status(400).send();
        });
          
    });
    
});

router.get('/',(req,res) => {
    Post.countDocuments().then(postCount => {
        if (postCount<1) {
            res.render('home/index',{Nopost: 'Please create the post first'});
        } else {
            const perPage = 10;
    const page = req.query.page || 1;

    
    Post.find({})
    .populate('user')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then((posts) => {
        Post.countDocuments().then(postCount => {
            Category.find({}).then(categories => {
                res.render('home/index',{
                    posts,
                    categories,
                    current : parseInt(page),
                    pages : Math.ceil(postCount/perPage)
                });
            });
        })
       
        
    }).catch(e => {
        res.status(400).send();
    });
        }
    });
    
    
    // res.send('hellowworld');
});
router.get('/about',(req,res) => {
    
    res.render('home/about');
    // res.send('hellowworld');
});
router.get('/login',userUnAuthenticated,(req,res) => {
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
            if(err) { return done(null, false, { message: 'This account has already been registered through Google+.' });}
            if (matched) {
                return done(null,user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        })
      });
}));

// facebook-stragety
// let FACEBOOK_APP_ID = '490231484777745';
// let FACEBOOK_APP_SECRET = 'b8c09b9ff52033a8fea09f4290ac8b53'
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//     User.findOne({facebookId: profile.id}).then((currentUser)=>{
//         if (currentUser) {
//             console.log('user is:',currentUser);
//             done(null,currentUser);
//         } else {
//             new User({ 
//                 username: profile.displayName,
//                 googleId: profile.id,
//                 thumbNail:profile._json.image.url
//             }).save().then((newUser) => {
//                 console.log('new user added',newUser);
//                 done(null,newUser);
//             });
//         }
//     });
//   }
// ));



// google stragety
passport.use(
    new googleStrategy({
        clientID: keys.clientID ,
        clientSecret: keys.clientSecret,
        callbackURL: "http://localhost:3000/google/redirect"
},(accessToken,refreshToken,profile,done) => {
    // passport callback function
    // cheak user if already exist in db
    User.findOne({googleId: profile.id}).then((user)=>{
        if (user) {
            // console.log('user is:',user);
            done(null,user);
        } else {
             new User({
                firstName : profile.name.givenName,
                lastName : profile.name.familyName,
                email : profile.emails[0].value,
                googleId : profile._json.id,
                profilePic : profile._json.image.url
            }).save().then((newUser) => {
                    // console.log('new user added',newUser);
                    done(null,newUser);
                });
            // console.log(profile);
        }
    });
    
    // console.log(accessToken);
    // done(null,profile);
})
);


passport.serializeUser(function(user, done) {
    // console.log(user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// google login
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/redirect',passport.authenticate('google'),(req,res) => {
    res.redirect('/admin/')
})

//   local login
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


router.get('/register',userUnAuthenticated,(req,res) => {
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
        // console.log(post.user)
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