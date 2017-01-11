
var multiparty = require("multiparty");
var magick     = require("../../../magick");
var router     = process.global.router;
var db         = process.global.db;
var title      = 'Pela Admin | ';
var defaultUrl = __dirname + "/../../../public/site/assets/static/stories/default.png";

router.get('/admin/stories', function(req, res)
{
    db.stories.read(function(err, stories)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/stories',
        {
            title   : title + "Stories",
            view    : "stories",
            stories : stories
        });
    });
});

router.get('/admin/stories/add', function(req, res)
{
    db.stories.count(function(err, count)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/stories/add',
        {
            title : title + "Add Story",
            view  : "addstory",
            count : count
        });
    });

});

router.get('/admin/stories/edit/:id', function(req, res)
{
    db.stories.read(req.params.id, function(err, story)
    {
        if(err)
        {
            return res.error(err);
        }

        db.stories.count(function(err, count)
        {
            res.render('admin/stories/edit',
            {
                title : title + "Edit Story",
                view  : "editstory",
                story : story,
                count : count
            });
        });
    });
});

router.post('/admin/stories/add', function(req, res)
{
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files)
    {
        if(err)
        {
            return res.error(err);
        }

        var category    = fields.category && String(fields.category[0]);
        var title       = fields.title && String(fields.title[0]);
        var description = fields.description && String(fields.description[0]);
        var localUrl    = files.image && files.image[0].size > 0 && files.image[0].path;
        var data        =
        {
            category    : category,
            title       : title,
            description : description
        };

        db.stories.create(data, function(err, story)
        {
            if(err)
            {
                return res.send(err);
            }

            localUrl = localUrl || defaultUrl;

            magick.stories.create(story._id, localUrl, function(err)
            {
                res.redirect("/admin/stories");
            });
        });
    });
});

router.post('/admin/stories/edit/:id', function(req, res)
{
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files)
    {
        if(err)
        {
            return res.error(err);
        }

        var category    = fields.category && String(fields.category[0]);
        var title       = fields.title && String(fields.title[0]);
        var description = fields.description && String(fields.description[0]);
        var localUrl    = files.image && files.image[0].size > 0 && files.image[0].path;
        var data        =
        {
            category    : category,
            title       : title,
            description : description
        };

        db.stories.update(req.params.id, data, function(err, story)
        {
            if(err)
            {
                return res.error(err);
            }

            localUrl = localUrl || defaultUrl;

            magick.stories.create(req.params.id, localUrl, function(err)
            {
                if(err)
                {
                    return res.error(err);
                }

                res.redirect("/admin/stories");
            });
        });
    });
});

router.post('/admin/stories/delete/:id', function(req, res)
{
    db.stories.delete(req.params.id, function(err)
    {
        if(err)
        {
            return res.error(err);
        }

        magick.stories.delete(req.params.id, function(err)
        {
            if(err)
            {
                return res.error(err);
            }

            res.redirect("/admin/stories");
        });
    });
});



