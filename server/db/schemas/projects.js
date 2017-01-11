
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

    title :
    {
        type    : String,
        default : ""
    },

    location :
    {
        type    : String,
        default : ""
    },

    description :
    {
        type    : String,
        default : ""
    },

    types :
    {
        type    : Array,
        default : [/*String*/]
    },

    images :
    {
        type    : Array,
        default : [/*{id:String, caption:String}*/]
    }
},
{
    collection : "projects"
});

module.exports = Schema;
