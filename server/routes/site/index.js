

var router       = process.global.router;
var db           = process.global.db;
var config       = process.global.config;
var MobileDetect = require("mobile-detect");
var title        = "P.E.L.A Design, Inc. | ";

router.use(function(req, res, next)
{
    var md = new MobileDetect(req.headers["user-agent"]);

    req.device =
    {
        isMobile : typeof md.mobile() === "string",
        isPhone  : typeof md.phone()  === "string",
        isTablet : typeof md.tablet() === "string"
    };

    req.config =
    {
        SLIDE_IMAGE_WIDTH    : config.SLIDE_IMAGE_WIDTH,
        SLIDE_IMAGE_HEIGHT   : config.SLIDE_IMAGE_HEIGHT,
        PROJECT_IMAGE_WIDTH  : config.PROJECT_IMAGE_WIDTH,
        PROJECT_IMAGE_HEIGHT : config.PROJECT_IMAGE_HEIGHT,
        PROJECT_THUMB_WIDTH  : config.PROJECT_THUMB_WIDTH,
        PROJECT_THUMB_HEIGHT : config.PROJECT_THUMB_HEIGHT,
        STORY_IMAGE_WIDTH    : config.STORY_IMAGE_WIDTH,
        STORY_IMAGE_HEIGHT   : config.STORY_IMAGE_HEIGHT,
        MOBILE_WIDTH         : config.MOBILE_WIDTH
    };

    next();
});

router.get("/", function(req, res)
{
    db.slides.read(function(err, slides)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render("site/home",
        {
            title  : title + "Home",
            view   : "home",
            slides : slides,
            device : req.device,
            config : req.config
        });
    });
});


router.get("/projects", function(req, res)
{
    var type = req.query.type;

    db.projects.getTypes(function(err, types)
    {
        if(err)
        {
            return res.error(err);
        }

        db.projects.getActive(type, function(err, projects)
        {
            if(err)
            {
                return res.error(err);
            }

            res.render("site/projects",
            {
                title    : title + "Projects",
                view     : "projects",
                projects : projects,
                type     : type,
                types    : types,
                device   : req.device,
                config   : req.config
            });
        });
    });
});


router.get("/projects/:id", function(req, res)
{

    db.projects.getProjectData(req.params.id, function(err, data)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render("site/project",
        {
            title           : title + "Project",
            view            : "project",
            project         : data.currentProject,
            nextProject     : data.nextProject,
            prevProject     : data.prevProject,
            relatedProjects : data.relatedProjects,
            device          : req.device,
            config          : req.config
        });
    });
});


router.get("/about", function(req, res)
{
    res.render("site/about",
    {
        title : title + "About Us",
        view  : "about",
        device : req.device,
        config : req.config
    });
});


router.get("/news", function(req, res)
{
    db.stories.read(function(err, stories)
    {

        var news   = [];
        var awards = [];

        for(var i=0; i<stories.length; i++)
        {
            var story = stories[i];

            if(story.category === "news")
            {
                news.push(story);
            }
            else
            if(story.category === "awards")
            {
                awards.push(story);
            }
        }

        res.render("site/news",
        {
            title   : title + "News & Awards",
            view    : "news",
            news    : news,
            awards  : awards,
            device  : req.device,
            config  : req.config
        });
    });
});


router.get("/contact", function(req, res)
{
    res.render("site/contact",
    {
        title : title + "Contact",
        view  : "contact",
        device : req.device,
        config : req.config
    });
});
