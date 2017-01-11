
var mongoose = require("mongoose");
var Schema   = require("../schemas/stories");
var Model    = mongoose.model("Story", Schema);


module.exports = Model;
