
var config  = process.global.config;
var utils   = require("../utils");
var fs      = require("fs");
var cp      = require("child_process");
var baseDir = __dirname + "/../../public/site/assets/dynamic/projects/";


function create(id, localUrls, callback)
{
    if(localUrls.length === 0)
    {
        return callback(null);
    }

    var dir = baseDir + id + "/";

    utils.createDir(dir, function()
    {
        var imageIds   = [];
        var completed  = 0;
        var hasErrored = false;

        for(var i=0; i<localUrls.length; i++)
        {
            var imageId  = String(Math.ceil(Math.random() * 1000000000000));
            var basePath = dir + imageId;
            var from     = localUrls[i];

            createImages(from, basePath, onComplete);
            imageIds.push(imageId);
        }

        function onComplete(err)
        {
            if(hasErrored)
            {
                return;
            }

            if(err)
            {
                hasErrored = true;
                return callback(err);
            }

            if(++completed === localUrls.length)
            {
                callback(null, imageIds);
            }
        }
    });
};

function createImages(from, basePath, callback)
{
    var to     = basePath + ".png";
    var width  = config.PROJECT_IMAGE_WIDTH;
    var height = config.PROJECT_IMAGE_HEIGHT;

    // create desktop image
    utils.createImage(from, to, width, height, function(err)
    {
        if(err)
        {
            return callback(err);
        }

        to     = basePath + "-mobile.png";
        width  = Math.floor(config.PROJECT_IMAGE_WIDTH  * 0.5);
        height = Math.floor(config.PROJECT_IMAGE_HEIGHT * 0.5);

        // create mobile image
        utils.createImage(from, to, width, height, function(err)
        {
            if(err)
            {
                return callback(err);
            }

            to     = basePath + "-thumb.png";
            width  = config.PROJECT_THUMB_WIDTH;
            height = config.PROJECT_THUMB_HEIGHT;

            // create thumb image
            utils.createImage(from, to, width, height, function(err)
            {
                if(err)
                {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
}

function remove(projectId, imgId, callback)
{
    if(typeof imgId === "function")
    {
        callback = imgId;
        var dir = baseDir + projectId + "/";
        utils.removeDir(dir, process.noop);
        callback(null);
        return;
    }

    var base = baseDir + projectId + "/" + imgId;
    fs.unlink(base + ".png",        process.noop);
    fs.unlink(base + "-mobile.png", process.noop);
    fs.unlink(base + "-thumb.png",  process.noop);
    callback(null);
};

module.exports =
{
    create : create,
    delete : remove
};

