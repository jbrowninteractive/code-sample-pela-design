
var config = process.global.config;
var utils  = require("../utils");
var dir    = __dirname + "/../../public/site/assets/dynamic/slides/";

function create(id, localUrl, callback)
{
    var from   = localUrl;
    var to     = dir + id +".png";
    var width  = config.SLIDE_IMAGE_WIDTH;
    var height = config.SLIDE_IMAGE_HEIGHT;

    utils.createImage(from, to, width, height, function(err)
    {
        if(err)
        {
            return callback(err);
        }

        to     = dir + id + "-mobile.png";
        width  = Math.floor(config.SLIDE_IMAGE_WIDTH  * 0.5);
        height = Math.floor(config.SLIDE_IMAGE_HEIGHT * 0.5);

        utils.createImage(from, to, width, height, function(err)
        {
            if(err)
            {
                return callback(err);
            }

            callback(null);
        });
    });
};

function remove(id, callback)
{
    utils.removeImage(dir + id + ".png",        process.noop);
    utils.removeImage(dir + id + "-mobile.png", process.noop);
    callback(null);
};

module.exports =
{
    create : create,
    delete : remove
};

