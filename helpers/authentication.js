module.exports = {
    userAuthenticated : function(req,res,next){
        if (req.isAuthenticated() || req.user) {
            return next();
        }
        res.redirect('/login')
    },
    userUnAuthenticated : function(req,res,next){
        if (!req.isAuthenticated() || !req.user) {
            return next();
        }
        res.redirect('/')
    }
}