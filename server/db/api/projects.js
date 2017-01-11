
var Model = require("../models/projects");

function create(data, callback)
{
    var document = new Model(data);

    document.save(function(err)
    {
        if(err)
        {
            return callback(err);
        }

        callback(null, document);
    });
};

function read(id, callback)
{
    if(typeof id === "function")
    {
        callback = id;

        return Model.find({}, function(err, documents)
        {
            if(err)
            {
                return callback(err);
            }

            for(var i=0; i<documents.length; i++)
            {
                var doc = documents[i];

                doc.types.sort();
            }

            callback(null, documents);
        });
    }

    Model.findOne({_id:id}, function(err, document)
    {
        if(err)
        {
            return callback(err);
        }

        if(!document)
        {
            var err = new Error("Invalid Project ID");
            return callback(err);
        }

        callback(null, document);
    });
};

function update(id, data, callback)
{
    read(id, function(err, document)
    {
        if(err)
        {
            return callback(err);
        }

        for(var key in data)
        {
            document[key] = data[key];
        }

        document.save(function(err)
        {
            if(err)
            {
                return callback(err);
            }

            callback(null, document);
        });
    });
};

function remove(id, callback) // delete is a protected function name
{
    read(id, function(err, document)
    {
        if(err)
        {
            return callback(err);
        }

        document.remove(function(err)
        {
            if(err)
            {
                return callback(err);
            }

            callback(null);
        });
    });
};

function count(callback)
{
    Model.count(function(err, count)
    {
        if(err)
        {
            return callback(err);
        }

        callback(null, count);
    });
};

function getTypes(callback)
{
    Model.find({}).select("types").exec(function(err, documents)
    {
        if(err)
        {
            return callback(err);
        }

        var types = [];

        for(var i=0; i<documents.length; i++)
        {
            var doc = documents[i];

            for(var j=0; j<doc.types.length; j++)
            {
                var type = doc.types[j];
                if(types.indexOf(type) === -1)
                {
                    types.push(type);
                }
            }
        }

        types.sort();

        callback(null, types);
    });
}

function getActive(type, callback)
{
    var filter =
    {
        active : true,
    };

    if(type)
    {
        filter.types = type;
    }

    Model.find(filter).sort("created").exec(function(err, documents)
    {
        if(err)
        {
            return callback(err);
        }

        for(var i=0; i<documents.length; i++)
        {
            var doc = documents[i];

            doc.types.sort();
        }

        callback(null, documents);
    });
}

function getProjectData(currentId, callback)
{
    var data = {};

    // get current
    read({_id:currentId}, function(err, project)
    {
        if(err)
        {
            return callback(err);
        }

        data.currentProject = project;

        // get related projects
        getRelatedProjects(data.currentProject, function(err, projects)
        {
            if(err)
            {
                return callback(err);
            }

            data.relatedProjects = projects;

            // get next
            getRandomProject(function(err, project)
            {
                if(err)
                {
                    return callback(err);
                }

                data.nextProject = project;

                // get prev
                getRandomProject(function(err, project)
                {
                    if(err)
                    {
                        return callback(err);
                    }

                    data.prevProject = project;

                    callback(null, data);
                });
            });
        });
    });
}

function getRelatedProjects(project, callback)
{
    // just return 3 random projects
    getRandomProjects(3, function(err, projects)
    {
        if(err)
        {
            return callback(err);
        }

        callback(null, projects);
    });
}

function getRandomProject(callback)
{
    count(function(err, total)
    {
        if(err)
        {
            return callback(err);
        }

        var rand = Math.floor(Math.random() * total);

        Model.findOne().skip(rand).exec(function(err, project)
        {
            if(err)
            {
                return callback(err);
            }

            if(!project)
            {
                return getRandomProject(callback);
            }

            callback(null, project);
        });
    });
}

function getRandomProjects(n, callback)
{
    var projects = [];
    var errored  = false;

    for(var i=0; i<n; i++)
    {
        getRandomProject(onComplete);
    }

    function onComplete(err, project)
    {
        if(errored)
        {
            return;
        }

        if(err)
        {
            errored = true;
            return callback(err);
        }

        projects.push(project);

        // not checking for duplicates
        if(projects.length === n)
        {
            callback(null, projects);
        }
    }
}


module.exports =
{
    create         : create,
    read           : read,
    update         : update,
    delete         : remove,
    count          : count,
    getTypes       : getTypes,
    getActive      : getActive,
    getProjectData : getProjectData
};
