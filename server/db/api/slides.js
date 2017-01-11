
var Model = require("../models/slides");

function create(data, callback)
{
    var document = new Model(data);

    document.save(function(err)
    {
        if(err)
        {
            return callback(err);
        }

        sortPositions(document, function(err)
        {
            if(err)
            {
                return callback(err);
            }

            callback(null, document);
        });
    });
};

function read(id, callback)
{
    if(typeof id === "function")
    {
        callback = id;

        return Model.find({}).sort("position").exec(function(err, documents)
        {
            if(err)
            {
                return callback(err);
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

        var currentPosition = document.position;

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

            if(document.position === currentPosition)
            {
                return callback(null, document);
            }

            sortPositions(document, function(err)
            {
                if(err)
                {
                    return callback(err);
                }

                callback(null, document);
            });
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

            sortPositions(null, function(err)
            {
                if(err)
                {
                    return callback(err);
                }

                callback(null);
            });
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

function sortPositions(document, callback)
{
    var targetPosition = document && document.position;

    Model.find({}, function(err, documents)
    {
        if(err)
        {
            return callback(err);
        }

        if(documents.length === 0)
        {
            callback(null);
        }

        for(var i=0; i<documents.length; i++)
        {
            var item = documents[i];

            if(!document || i+1 < document.position)
            {
                item.position = i+1;
                continue;
            }

            if(String(item._id) === String(document._id))
            {
                continue;
            }

            item.position = ++targetPosition;
        }

        // save items
        var saved   = 0;
        var errored = false;

        for(var i=0; i<documents.length; i++)
        {
            var item = documents[i];

            item.save(function(err)
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

                if(++saved === documents.length)
                {
                    callback(null);
                }
            });
        }

    }).sort({position:1});
}

module.exports =
{
    create : create,
    read   : read,
    update : update,
    delete : remove,
    count  : count
};
