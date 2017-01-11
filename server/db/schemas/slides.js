
var mongoose = require("mongoose");

var Schema = new mongoose.Schema(
{
    created :
    {
        type    : Number,
        default : Date.now
    },

    active :
    {
        type    : Boolean,
        default : true
    },

    position :
    {
        required : true,
        type     : Number
    },

    title :
    {
        type    : String,
        default : ""
    }
},
{
    collection : "slides"
});

module.exports = Schema;
