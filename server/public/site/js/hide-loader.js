

window.onload = function()
{
    var loader = document.getElementsByClassName("page-loader")[0];
    loader.style.transition = "opacity 0.5s";
    loader.style.opacity = 0;

    setTimeout(function()
    {
        document.body.style.overflowY = "scroll";
        loader.style.display = "none";
    }, 200);
};
