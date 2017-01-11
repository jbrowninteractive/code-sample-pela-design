
var multiparty = require("multiparty");
var magick     = require("../../../magick");
var router     = process.global.router;
var db         = process.global.db;
var title      = 'Pela Admin | ';


router.get('/admin/projects', function(req, res)
{
    db.projects.read(function(err, projects)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/projects',
        {
            title    : title + "Projects",
            view     : "projects",
            projects : projects
        });
    });
});

router.get('/admin/projects/add', function(req, res)
{
    db.projects.getTypes(function(err, types)
    {
        if(err)
        {
            return res.error(err);
        }

        res.render('admin/projects/add',
        {
            title : title + "Add Project",
            view  : "addproject",
            types : types
        });
    });
});

router.get('/admin/projects/edit/:id', function(req, res)
{
    db.projects.read(req.params.id, function(err, project)
    {
        if(err)
        {
            return res.error(err);
        }

        db.projects.getTypes(function(err, types)
        {
            if(err)
            {
                return res.error(err);
            }

            res.render('admin/projects/edit',
            {
                title   : title + "Edit Project",
                view    : "editproject",
                project : project,
                types   : types
            });
        });
    });
});

router.post('/admin/projects/add', function(req, res)
{
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files)
    {
        if(err)
        {
            return res.error(err);
        }

        var active      = fields.active   && fields.active[0] === "on" || false;
        var title       = fields.title    && String(fields.title[0]);
        var location    = fields.location && String(fields.location[0]);
        var description = fields.title    && String(fields.description[0]);
        var types       = fields.types || [];
        var images      = files.images || [];
        var localUrls   = [];
        var data        =
        {
            active      : active,
            title       : title,
            location    : location,
            description : description,
            types       : types
        };



        db.projects.create(data, function(err, project)
        {
            if(err)
            {
                return res.send(err);
            }

            for(var i=0; i<images.length; i++)
            {
                var img = files.images[i];
                var url = img.size > 0 && img.path;

                if(url)
                {
                    localUrls.push(url);
                }
            }

            if(localUrls.length === 0)
            {
                return res.redirect("/admin/projects");
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
                    var caption = "";

                    if(!imageId)
                    {
                        continue;
                    }

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
                        return res.send(err);
                    }

                    res.redirect("/admin/projects");
                });
            });
        });
    });
});

router.post('/admin/projects/edit/:id', function(req, res)
{
    db.projects.read(req.params.id, function(err, project)
    {
        if(err)
        {
            return res.error(err);
        }

        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files)
        {
            if(err)
            {
                return res.error(err);
            }

            var active      = fields.active   && fields.active[0] === "on" || false;
            var title       = fields.title    && String(fields.title[0]);
            var location    = fields.location && String(fields.location[0]);
            var description = fields.title    && String(fields.description[0]);
            var types       = fields.types   || [];
            var origIds     = fields.origIds || [];
            var images      = files.images   || [];
            var count       = 0;
            var created     = 0;
            var data        =
            {
                active      : active,
                title       : title,
                location    : location,
                description : description,
                types       : types,
                images      : []
            };

            // remove blank images from images array
            for(var i=images.length-1; i>=0; i--)
            {
                var image    = images[i];
                var origId   = origIds[i];
                var localUrl = image.size > 0 && image.path;

                if(!origId && !localUrl)
                {
                    origIds.splice(i, 1);
                    images.splice(i, 1);
                }
            }

            // remove unused original images
            for(var i=0; i<project.images.length; i++)
            {
                var image = project.images[i];

                if(origIds.indexOf(image.id) === -1)
                {
                    remove(image.id);
                }
            }

            // reorder existing orig images + create new ones
            for(var i=0; i<origIds.length; i++)
            {
                var origId = origIds[i];

                if(origId)
                {
                    data.images[i] =
                    {
                        id      : origId,
                        caption : ""
                    };

                    continue;
                }

                create(i);
            }

            // if no new images just update database
            if(count === 0)
            {
                return update();
            }

            function create(index)
            {
                var localUrl = images[index].path;

                magick.projects.create(project._id, [localUrl], function(err, ids)
                {
                    data.images[index] =
                    {
                        id      : ids[0],
                        caption : ""
                    };

                    if(++created === count)
                    {
                        update();
                    }
                });

                count++;
            }

            function remove(imageId)
            {
                magick.projects.delete(project._id, imageId, process.noop);
            }

            function update()
            {
                db.projects.update(project._id, data, function(err, project)
                {
                    if(err)
                    {
                        return res.send(err);
                    }

                    res.redirect("/admin/projects");
                });
            }
        });
    });
});

router.post('/admin/projects/delete/:id', function(req, res)
{
    db.projects.delete(req.params.id, function(err)
    {
        if(err)
        {
            return res.error(err);
        }

        magick.projects.delete(req.params.id, function(err)
        {
            if(err)
            {
                return res.error(err);
            }

            res.redirect("/admin/projects");
        });
    });
});
