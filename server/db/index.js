

var config       = process.global.config;
var mongoose     = require("mongoose");
var StoryModel   = require("./models/stories");
var ProjectModel = require("./models/projects");
var SlideModel   = require("./models/slides");

mongoose.connect(config.DB_URL, function(err)
{
    console.log("Mongoose connection:", err || config.DB_URL);
});

module.exports =
{
    stories  : require("./api/stories"),
    projects : require("./api/projects"),
    slides   : require("./api/slides")
};
