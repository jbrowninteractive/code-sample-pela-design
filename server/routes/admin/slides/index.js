
var multiparty = require("multiparty");
var magick     = require("../../../magick");
var router     = process.global.router;
var db         = process.global.db;
var title      = 'Pela Admin | ';
var defaultUrl = __dirname + "/../../../public/site/assets/static/slides/default.png";

router.get('/admin/slides', function(req, res)
{
    db.slides.read(function(err, slides)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/slides',
        {
            title  : title + "Slides",
            view   : "slides",
            slides : slides
        });
    });
});

router.get('/admin/slides/add', function(req, res)
{
    db.slides.count(function(err, count)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/slides/add',
        {
            title : title + "Add Slide",
            view  : "addslide",
            count : count
        });
    });

});

router.get('/admin/slides/edit/:id', function(req, res)
{
    db.slides.read(req.params.id, function(err, slide)
    {
        if(err)
        {
            return res.error(err);
        }

        db.slides.count(function(err, count)
        {
            res.render('admin/slides/edit',
            {
                title : title + "Edit Slide",
                view  : "editslide",
                slide : slide,
                count : count
            });
        });
    });
});

router.post('/admin/slides/add', function(req, res)
{
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files)
    {
        if(err)
        {
            return res.error(err);
        }

        var position = fields.position && Number(fields.position[0]);
        var title    = fields.title && String(fields.title[0]);
        var localUrl = files.image && files.image[0].size > 0 && files.image[0].path;
        var data     =
        {
            position : position,
            title    : title
        };

        db.slides.create(data, function(err, slide)
        {
            localUrl = localUrl || defaultUrl;

            magick.slides.create(slide._id, localUrl, function(err)
            {
                res.redirect("/admin/slides");
            });
        });
    });
});

router.post('/admin/slides/edit/:id', function(req, res)
{
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files)
    {
        if(err)
        {
            return res.error(err);
        }

        var position = fields.position && Number(fields.position[0]);
        var title    = fields.title && String(fields.title[0]);
        var localUrl = files.image && files.image[0].size > 0 && files.image[0].path;
        var data     =
        {
            position : position,
            title    : title
        };

        db.slides.update(req.params.id, data, function(err, slide)
        {
            if(err)
            {
                return res.error(err);
            }

            if(!localUrl)
            {
                return res.redirect("/admin/slides");
            }

            magick.slides.create(req.params.id, localUrl, function(err)
            {
                if(err)
                {
                    return res.error(err);
                }

                res.redirect("/admin/slides");
            });
        });
    });
});

router.post('/admin/slides/delete/:id', function(req, res)
{
    db.slides.delete(req.params.id, function(err)
    {
        if(err)
        {
            return res.error(err);
        }

        magick.slides.delete(req.params.id, function(err)
        {
            if(err)
            {
                return res.error(err);
            }

            res.redirect("/admin/slides");
        });
    });
});



