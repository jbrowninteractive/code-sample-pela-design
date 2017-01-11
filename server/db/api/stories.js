
var Model = require("../models/stories");

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

        return Model.find({}).sort("category").exec(function(err, documents)
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

module.exports =
{
    create : create,
    read   : read,
    update : update,
    delete : remove,
    count  : count
};
