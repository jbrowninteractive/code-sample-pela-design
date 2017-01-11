
var Canvas = require("canvas");
var fs     = require("fs");
var cp     = require("child_process");

function createImage(from, to, width, height, callback)
{
    var img    = new Canvas.Image();
    img.onload = onImageLoaded;

    try
    {
        img.src = from;
    }
    catch(err)
    {
        return callback(err);
    }

    function onImageLoaded()
    {
        var cvs = new Canvas(width, height)
        var ctx = cvs.getContext("2d");
        var x   = 0;
        var y   = 0;
        var w   = 0;
        var h   = 0;

        // cvs.style.background = "black";

        if(img.width >= img.height)
        {
            // landscape
            h = height;
            w = img.width * (h / img.height);
            x = width / 2 - w / 2;
        }
        else
        {
            // portrait
            w = width;
            h = img.height * (w / img.width);
            y = height / 2 - h / 2;
        }

        ctx.drawImage(img, x, y, w, h);

        var out    = fs.createWriteStream(to);
        var stream = cvs.pngStream();

        stream.on("data", function(chunk)
        {
            out.write(chunk);
        });

        stream.on("end", function()
        {
            callback(null);
        });
    }
}

function removeImage(from, callback)
{
    fs.unlink(from, function(err)
    {
        if(err)
        {
            return callback(err);
        }

        callback(null);
    });
}

function createDir(dir, callback)
{
    fs.exists(dir, function(exists)
    {
        if(exists)
        {
            return callback(null);
        }

        fs.mkdir(dir, function(err)
        {
            if(err)
            {
                return callback(err);
            }

            callback(null);
        });
    });
}

function removeDir(dir, callback)
{
    var rm = cp.spawn("rm", ["-rf", dir]);

    rm.on("exit", function()
    {
        callback(null);
    });
}

module.exports =
{
    createImage : createImage,
    removeImage : removeImage,
    createDir   : createDir,
    removeDir   : removeDir
};
