
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

    category :
    {
        required : true,
        type     : String,
        enum     : ['news', 'awards']
    },

    title :
    {
        type    : String,
        default : ""
    },

    description :
    {
        type    : String,
        default : ""
    }
},
{
    collection : "stories"
});

module.exports = Schema;
