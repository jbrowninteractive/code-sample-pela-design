
var mongoose = require("mongoose");
var Schema   = require("../schemas/slides");
var Model    = mongoose.model("Slide", Schema);


module.exports = Model;
