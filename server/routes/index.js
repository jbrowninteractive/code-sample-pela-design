


var router  = process.global.router;
var app     = process.global.app;
var config  = process.global.config;

function initialize()
{
    app.use(function(req, res, next)
    {
        res.error = function(err)
        {
            err = err || new Error("Unknown Error");
            var msg = config.ENV === "development" ?
                "Error: " + err.message :
                "Something went wrong!";
            res.status(err.status || 500);
            res.send(msg);
            console.log(err);
        };

        next();
    });

    app.use("/", router);
    require('./site');
    require('./admin');
};


module.exports.initialize = initialize;
