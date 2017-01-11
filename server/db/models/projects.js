
var mongoose = require("mongoose");
var Schema   = require("../schemas/projects");
var Model    = mongoose.model("Project", Schema);

// Model.schema.path("email").validate(function(value)
// {
//     return true;
// },

// "Invalid Email");


module.exports = Model;
