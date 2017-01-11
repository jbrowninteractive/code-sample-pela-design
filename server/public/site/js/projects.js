
var node     = document.getElementsByClassName("types-mobile")[0];
var input    = node.getElementsByClassName("types-input")[0];
var typeNode = node.getElementsByClassName("type")[0];

input.onchange = function()
{
    var type = input.value;
    var url  = "/projects";

    if(type)
    {
        url += "?type=" + type;
    }

    window.location = url;
};
