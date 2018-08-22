let router = require('express').Router();
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

module.exports = router;