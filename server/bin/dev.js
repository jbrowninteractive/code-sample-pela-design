
var cp      = require("child_process");
var mongod  = cp.spawn("mongod", []);
var nodemon = cp.spawn("nodemon", ["../bin/www"]);

nodemon.stdout.on('data', function(data)
{
    console.log(data.toString());
});

nodemon.stderr.on('data', function(data)
{
    console.log(data.toString());
});

nodemon.on('close', function(code)
{
    console.log(`child process exited with code ${code}`);
});
