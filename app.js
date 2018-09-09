const express = require('express');
let app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodeOverRide = require('method-override');
const upload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const port = process.env.PORT || 3000;


// connecting to database
mongoose.connect(mongoDbUrl,{ useNewUrlParser: true })
.then((db) => console.log('sucessfully cconnected to the database'))
.catch(e => console.log(e));


app.use(express.static(path.join(__dirname,'public')));

// settng handlebars middleware
const {select,GenerateTime,paginate} = require('./helpers/handlebars-helper');
app.engine('handlebars',exphbs({defaultLayout:'home', helpers:{select,GenerateTime,paginate}}));
app.set('view engine','handlebars');


// express-session and flash middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));
  app.use(flash());

//   passport initalization
app.use(passport.initialize());
app.use(passport.session());

//   local variables using middleware
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.success_fake_message = req.flash('success_fake_message');
    res.locals.success_edit_message = req.flash('success_edit_message');
    res.locals.success_delete_message = req.flash('success_delete_message');
    res.locals.error = req.flash('error');
    next();
})

// method overRide middleware
app.use(methodeOverRide('_method'));

// using fileuploads middleware
app.use(upload());

// body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// handlein routes
const home = require('./routes/home/index');
app.use('/',home);
const admin = require('./routes/admin/index');
app.use('/admin',admin);
const posts = require('./routes/admin/posts');
app.use('/admin/posts',posts);
const categories = require('./routes/admin/categories');
app.use('/admin/categories',categories);
const comments = require('./routes/admin/comments');
app.use('/admin/comments',comments);



// io through port
app.listen(port,()=> {
    console.log(`the app is running on port: ${port}`);
});
