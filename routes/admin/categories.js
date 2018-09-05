let router = require('express').Router();
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');
// over-ridding the default layout
router.all('/*',userAuthenticated,(req,res,next) => {
    req.app.locals.layout ='admin';
    next();
})


router.get('/',(req,res) => {

    Category.find({}).then(categories => {
        // console.log(doc)
        res.render('admin/categories/index',{categories});
    }).catch(e => res.status(400).send());
    // res.send('hellowworld');
});
router.post('/create',(req,res) => {
    // console.log(req.body.name)
    let newCategory = new Category({name : req.body.name})
    newCategory.save().then((category) => {
        // res.render('admin/categories/index',{doc})
        req.flash('success_message',`Category ${category.name} was created sucessfully`);
        res.redirect('/admin/categories')
    }).catch(e => res.status(400).send());
    
    // res.send('hellowworld');
});
router.get('/edit/:id',(req,res) => {

    Category.findOne({_id:req.params.id}).then(category => {
        // console.log(doc)
        res.render('admin/categories/edit',{category});
    }).catch(e => res.status(400).send());
    // res.send('hellowworld');
});
router.put('/edit/:id',(req,res) => {

    Category.findOne({_id:req.params.id}).then(category => {
        // console.log(doc)
        category.name = req.body.name;
        category.save().then((category) => {
            req.flash('success_edit_message',`Category ${category.name} was edited sucessfully`);
            res.redirect('/admin/categories');
        });
        
    }).catch(e => res.status(400).send());
    // res.send('hellowworld');
});
router.delete('/:id',(req,res) => {

    Category.findOneAndRemove({_id:req.params.id}).then(category => {
        // console.log(doc)
        req.flash('success_delete_message',`Category ${category.name} was deleted sucessfully`);
        res.redirect('/admin/categories');
    }).catch(e => res.status(400).send());
    // res.send('hellowworld');
});

module.exports = router;