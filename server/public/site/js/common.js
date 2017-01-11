
var WINDOW_RESIZE          = "windowResize";
var BELOW_MOBILE_THRESHOLD = "belowMobileThreshold";
var ABOVE_MOBILE_THRESHOLD = "aboveMobileThreshold";
var displayMobile          = false;


(function()
{
    var width         = NaN;
    var height        = NaN;
    var dispatchBelow = true;
    var dispatchAbove = true

    setInterval(dispatchResize, 200);

    function dispatchResize()
    {
        var event = new Event(WINDOW_RESIZE);
        window.dispatchEvent(event);
    }

    function onAnimationFrame()
    {
        if(width !== window.innerWidth || height !== window.innerHeight)
        {
            width  = window.innerWidth;
            height = window.innerHeight;

            dispatchResize();

            if(width < config.MOBILE_WIDTH && dispatchBelow)
            {
                var event = new Event(BELOW_MOBILE_THRESHOLD);
                dispatchBelow = false;
                dispatchAbove = true;
                displayMobile = true;
                window.dispatchEvent(event);
            }
            else
            if(width > config.MOBILE_WIDTH && dispatchAbove)
            {
                var event = new Event(ABOVE_MOBILE_THRESHOLD);
                dispatchAbove = false;
                dispatchBelow = true;
                displayMobile = device.isMobile;
                window.dispatchEvent(event);
            }

        }
        requestAnimationFrame(onAnimationFrame);
    }
    onAnimationFrame();

})();


(function()
{
    window.addEventListener(BELOW_MOBILE_THRESHOLD, sortQuerySelectors);
    window.addEventListener(ABOVE_MOBILE_THRESHOLD, sortQuerySelectors);
    window.addEventListener("load",                 sortQuerySelectors);

    function sortQuerySelectors()
    {
        var nodes = document.getElementsByTagName("*");

        for(var i=0; i<nodes.length; i++)
        {
            var node = $(nodes[i]);
            displayMobile ? node.addClass("mobile") : node.removeClass("mobile");
        }
    }

})();

(function()
{
    var node     = document.getElementsByClassName("header-mobile")[0];
    var menuBtn  = node.getElementsByClassName("menu-btn")[0];
    var closeBtn = node.getElementsByClassName("menu-close-btn")[0];
    var menu     = node.getElementsByClassName("nav")[0];

    menuBtn.onclick = function()
    {
        menu.style.display = "block";
    };

    closeBtn.onclick = function()
    {
        menu.style.display = "none";
    };

})();
