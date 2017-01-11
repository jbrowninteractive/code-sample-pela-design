


var passport   = require("passport");
var Strategy   = require("passport-bitbucket-oauth2").Strategy;
var router     = process.global.router;

router.get("/login", function(req, res)
{
    res.redirect("/auth/bitbucket");
});

router.get('/logout', function(req, res)
{
    req.logout();
    res.redirect("/");
});

router.get('/auth/bitbucket', passport.authenticate('bitbucket'));

router.get('/auth/bitbucket/callback', passport.authenticate('bitbucket'), function(req, res)
{
    res.redirect("/admin");
});

router.get('/admin', function(req, res)
{
    res.redirect("/admin/slides");
});

require("./slides");
require("./projects");
require("./stories");
