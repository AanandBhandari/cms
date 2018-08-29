const express = require('express');
let app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodeOverRide = require('method-override');


// connecting to database
mongoose.connect('mongodb://localhost:27017/cms',{ useNewUrlParser: true })
.then((db) => console.log('sucessfully cconnected to the database'))
.catch(e => console.log(e));


app.use(express.static(path.join(__dirname,'public')));

// settng handlebars middleware
const {select} = require('./helpers/handlebars-helper');
app.engine('handlebars',exphbs({defaultLayout:'home', helpers:{select}}));
app.set('view engine','handlebars');

// method overRide middleware
app.use(methodeOverRide('_method'));

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



// io through port
app.listen(port,()=> {
    console.log(`the app is running on port: ${port}`);
});
