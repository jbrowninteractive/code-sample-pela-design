var node  = document.getElementsByClassName("image-ui")[0];
var input = node.children[0];
var img   = node.children[1];
var orig  = img.src;

input.onchange = function()
{
    if(!input.files[0])
    {
        return img.src = orig;
    }

    var reader = new FileReader();

    reader.onload = function (e)
    {
        img.src = e.target.result;
    }

    reader.readAsDataURL(input.files[0]);
};
