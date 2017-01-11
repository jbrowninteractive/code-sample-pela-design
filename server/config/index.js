
var app    = process.global.app;
var env    = app.get("env");
var dev    = env === "development";
var config =
{
    ENV                  : env,
    PORT                 : 8080,
    DB_URL               : "mongodb://127.0.0.1:27017/pela/",
    CLIENT_ID            : "[insert_client_id]",
    CLIENT_SECRET        : "[insert_client_secret]",
    CALLBACK_URL         : "[insert_callback_url]",
    SESSION_SECRET       : "[insert_session_secret]",
    PROFILE_ID           : "[insert_profile_id]",
    SLIDE_IMAGE_WIDTH    : 1024,
    SLIDE_IMAGE_HEIGHT   : 768,
    PROJECT_IMAGE_WIDTH  : 750,
    PROJECT_IMAGE_HEIGHT : 450,
    PROJECT_THUMB_WIDTH  : 200,
    PROJECT_THUMB_HEIGHT : 110,
    STORY_IMAGE_WIDTH    : 124,
    STORY_IMAGE_HEIGHT   : 69,
    MOBILE_WIDTH         : 800
};

if(!dev)
{
    config.CALLBACK_URL = "[insert_dev_callback_url]"
}

// console.log("config", config);
module.exports = config;
