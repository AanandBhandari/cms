let router = require('express').Router();
// over-ridding the default layout
router.all('/*',(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {
    // res.render('admin/index');
    // res.send('hellowworld');
});

router.get('/create',(req,res) => {
   res.render('admin/posts/create');
});
router.post('/create',(req,res) => {
    res.send('worked  here!');
 });
module.exports = router;