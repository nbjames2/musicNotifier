module.exports = {
    validateSignup(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("first", "must enter first name").isLength({min: 1});
            req.checkBody("last", "must be at least 2 characters in length").isLength({min: 2});
            req.checkBody("email", "must be a valid email address").isEmail();
            req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
            req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    },
    validateSignin(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("email", "must be a valid email address").isEmail();
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    },
    validateSearch(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("query", "Please enter an artist to search for").isLength({min: 1});
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    }

}