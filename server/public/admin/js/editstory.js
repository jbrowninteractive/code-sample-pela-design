var node  = document.getElementsByClassName("image-ui")[0];
var input = node.children[0];
var img   = node.children[1];

input.onchange = function()
{
    if(!input.files[0])
    {
        return img.style.display = "none";
    }

    var reader = new FileReader();

    reader.onload = function (e)
    {
        img.src = e.target.result;
        img.style.display = "block";
    }

    reader.readAsDataURL(input.files[0]);
};

