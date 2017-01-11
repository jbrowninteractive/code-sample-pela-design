
var config = process.global.config;
var utils  = require("../utils");
var dir    = __dirname + "/../../public/site/assets/dynamic/stories/";

function create(id, localUrl, callback)
{
    var from   = localUrl;
    var to     = dir + id +".png";
    var width  = config.STORY_IMAGE_WIDTH;
    var height = config.STORY_IMAGE_HEIGHT;

    utils.createImage(from, to, width, height, function(err)
    {
        if(err)
        {
            return callback(err);
        }

        callback(null);
    });
};

function remove(id, callback)
{
    utils.removeImage(dir + id + ".png",        process.noop);
    callback(null);
};

module.exports =
{
    create : create,
    delete : remove
};

