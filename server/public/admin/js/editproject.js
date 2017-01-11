
function addType()
{
    var container = document.getElementsByClassName("types-node")[0];
    var node      = new TextComponent("types", types);
    container.appendChild(node);
    return false;
}

function addImage()
{
    var container = document.getElementsByClassName("images-node")[0];
    var node      = new ImageComponent();
    container.appendChild(node);
    return false;
}

