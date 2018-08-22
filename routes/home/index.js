let router = require('express').Router();

router.all('/*',(req,res,next) => {
    req.app.locals.layout ='home';
    next();
});


router.get('/',(req,res) => {
    res.render('home/index');
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
module.exports = router;