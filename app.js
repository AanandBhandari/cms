const express = require('express');
let app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const port = 3000;


app.use(express.static(path.join(__dirname,'public')));

// settng handlebars middleware
app.engine('handlebars',exphbs({defaultLayout:'home'}));
app.set('view engine','handlebars');



// handlein routes
const main = require('./routes/home/main');
app.use('/',main);





// io through port
app.listen(port,()=> {
    console.log(`the app is running on port: ${port}`);
});
