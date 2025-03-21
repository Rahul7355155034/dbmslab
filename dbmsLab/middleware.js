//islogin
module.exports.isLoggedIn=(req,res,next)=>{
    if (typeof req.isAuthenticated !== 'function') {
        console.error("Passport is not properly initialized or session is not set up.");
        req.flash("error", "There was an internal error. Please try again.");
        return res.redirect("/listings/login");
    }
    if(!req.isAuthenticated() && req.originalUrl !== "/listings/login"){
        req.session.redirectUrl=req.originalUrl;
        console.log( req.session.redirectUrl);
    req.flash("error","you must be log in before add new list");
   return  res.redirect("/listings/login");
   }
next();
}



module.exports.savedRedirectUrl=(req,res,next)=>{
   
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        // Clear the redirectUrl from session once used}
        console.log( res.locals.redirectUrl);
     
        delete req.session.redirectUrl;
    }
   
next();
}