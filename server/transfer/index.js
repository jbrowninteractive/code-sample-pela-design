var origSiteDir  = __dirname + "/../original-site/server/";
var origDataUrl  = origSiteDir + "/data/data.json";
var origData     = require(origDataUrl);
var db           = require("../db");
var magick       = require("../magick");
var fs           = require("fs");
var cp           = require("child_process");

if(process.argv[2] === "true")
{
    console.log("transfer data...");
    setTimeout(init, 1000);
}

function init()
{
    setTimeout(deleteImages, 0000);
    setTimeout(addStories,   1000);
    setTimeout(addProjects,  2000);
}

function deleteImages(callback)
{
    var storiesDir  = __dirname + "/../public/site/assets/dynamic/stories/";
    var projectsDir = __dirname + "/../public/site/assets/dynamic/projects/";
    cp.exec("rm -rf " + storiesDir, function(){
        cp.exec("mkdir "  + storiesDir, process.noop);
    });
    cp.exec("rm -rf " + projectsDir, function(){
        cp.exec("mkdir "  + projectsDir, process.noop);
    });
}

function addStories()
{
    var stories   = [];
    var completed = 0;

    for(var i=0; i<origData.news.stories.length; i++)
    {
        var story      = origData.news.stories[i];
        story.category = "news";
        stories.push(story);
    }

    for(var i=0; i<origData.news.awards.length; i++)
    {
        var story      = origData.news.awards[i];
        story.category = "awards";
        stories.push(story);
    }

    for(var i=0; i<stories.length; i++)
    {
        var story       = stories[i];
        var active      = true;
        var category    = story.category;
        var title       = story.name || story.date;
        var description = story.description;
        var data        =
        {
            active      : active,
            category    : category,
            title       : title,
            description : description
        };

        addStory(story, data, onComplete);
    }

    function onComplete(err, story)
    {
        console.log("-------");
        console.log(story);

        if(err)
        {
            console.log("Error:");
            console.log(err);
        }

        if(++completed === stories.length)
        {
            console.log("-------- addStories complete ---------");
        }
    }
}

function addStory(origStory, data, callback)
{
    var defaultUrl = __dirname + "/../public/site/assets/static/stories/default.png";
    var localUrl   = origSiteDir + "public/images/news/";
        localUrl  += origStory.category === "news" ? "stories" : "awards";
        localUrl  += "/" + origStory.id + ".jpg";


    fs.exists(localUrl, function(exists)
    {
        if(!exists)
        {
            localUrl = defaultUrl;
        }

        db.stories.create(data, function(err, story)
        {

            if(err)
            {
                return callback(err);
            }

            magick.stories.create(story._id, localUrl, function(err)
            {
                if(err)
                {
                    return callback(err);
                }

                callback(null, story);
            });
        });
    });

}

function addProjects()
{
    var completed = 0;

    for(var i=0; i<origData.projects.length; i++)
    {
        var project     = origData.projects[i];
        var title       = project.name;
        var location    = project.location;
        var description = project.description;
        var types       = project.types;
        var active      = project.status;
        var origImages  = project.images;
        var images      = [];
        var data        =
        {
            title       : title,
            location    : location,
            description : description,
            types       : types,
            active      : active,
            images      : images
        };

        addProject(project, data, origImages, onComplete);
    }

    function onComplete(err, project)
    {
        console.log("-------");
        console.log(project);

        if(err)
        {
            console.log("Error:");
            console.log(err);
        }

        if(++completed === origData.projects.length)
        {
            console.log("-------- addProjects complete ---------");
        }
    }
}

function addProject(origProject, data, origImages, callback)
{

    var localUrls = [];

    for(var i=0; i<origImages.length; i++)
    {
        var image = origImages[i];
        var url   = origSiteDir + "public/images/projects/"
            url  += origProject.id + "/" + image.id + "_large.jpg";
        localUrls.push(url);
    }

    db.projects.create(data, function(err, project)
    {
        if(err)
        {
            return callback(err);
        }

        if(localUrls.length === 0)
        {
            return callback(null, project);
        }

        magick.projects.create(project._id, localUrls, function(err, imageIds)
        {
            data =
            {
                images : []
            };

            for(var i=0; i<imageIds.length; i++)
            {
                var imageId = imageIds[i];
                var caption = origImages[i].caption;

                var image =
                {
                    id      : imageId,
                    caption : caption
                };

                data.images.push(image);
            }

            db.projects.update(project._id, data, function(err, project)
            {
                if(err)
                {
                    return callback(err);
                }

                callback(null, project);
            });
        });
    });
}
