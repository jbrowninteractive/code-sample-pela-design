process.noop     = function(){};
process.global   = {};
var express      = require('express');
var passport     = require("passport");
var Strategy     = require("passport-bitbucket-oauth2").Strategy;
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var app          = process.global.app    = express();
var router       = process.global.router = express.Router();
var config       = process.global.config = require('./config');
var db           = process.global.db     = require('./db');
var routes       = process.global.routes = require('./routes');
var session      = require('express-session');
var sessionData  =
{
    secret            : config.SESSION_SECRET,
    resave            : true,
    saveUninitialized : true
};

// require("./transfer");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionData));
app.use(passport.initialize());
app.use(passport.session());
routes.initialize();

passport.serializeUser(function(user, done)
{
    done(null, user);
});

passport.deserializeUser(function(obj, done)
{
    done(null, obj);
});

passport.use(new Strategy(
{
    clientID     : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL  : config.CALLBACK_URL
},
function(token, tokenSecret, user, done)
{
    if(user.id === config.PROFILE_ID)
    {
        return done(null, user);
    }

    done(null, false);
}));
