
var SLIDE_DELAY = 5000;
var slideShow   = new SlideShow();
var slideTimer  = new SlideTimer();
var pageAlign   = new PageAlign();


function SlideShow()
{

    this._build = function()
    {
        this.node         = document.getElementsByClassName("slideshow")[0];
        this.slides       = [];
        this.currentSlide = null;
        setTimeout(this._init.bind(this), 1);
    };

    this._init = function()
    {
        this._createSlides();
        this._align();

        if(device.isMobile)
        {
            $(this.node).touchwipe(
            {
                wipeLeft             : slideTimer.stop.bind(slideTimer),
                wipeRight            : slideTimer.stop.bind(slideTimer),
                preventDefaultEvents : true
            });

            $(this.node).touchwipe(
            {
                wipeLeft             : this.previous.bind(this),
                wipeRight            : this.next.bind(this),
                preventDefaultEvents : true
            });
        }
        else
        {
            this.node.onclick = this.next.bind(this);
        }

        window.addEventListener(WINDOW_RESIZE, this._align.bind(this));
    };

    this._createSlides = function()
    {
        var dots  = document.getElementsByClassName("dots")[0];
        var nodes = this.node.getElementsByClassName("slide");

        for(var i=0; i<nodes.length; i++)
        {
            var node  = nodes[i];
            var dot   = document.createElement("div");
            dot.className = "dot";
            dots.appendChild(dot);
            dot.onclick = this._onDotClicked.bind(this);
            var slide = new Slide(node, dot);
            dot.slide = slide;
            this.slides.push(slide);

            if(nodes.length < 2)
            {
                dot.style.display = "none";
            }
        }

        this.currentSlide = this.slides[0];
        this.currentSlide.show();
    };

    this._align = function()
    {
        var node = this.slides[0].node;
        this.node.style.height = node.offsetHeight + "px";
    };

    this.next = function(event)
    {
        if(this.slides.length < 2)
        {
            return;
        }

        var index = this.slides.indexOf(this.currentSlide);
        var next  = index === this.slides.length-1 ? 0 : index+1;
        this.currentSlide.hide();
        this.currentSlide = this.slides[next];
        this.currentSlide.show();
        if(event)
        {
            slideTimer.stop();
        }
    };

    this.previous = function(event)
    {
        if(this.slides.length < 2)
        {
            return;
        }

        var index = this.slides.indexOf(this.currentSlide);
        var next  = index === 0 ? this.slides.length-1 : index-1;
        this.currentSlide.hide();
        this.currentSlide = this.slides[next];
        this.currentSlide.show();
        slideTimer.stop()
    };

    this._onDotClicked = function(event)
    {
        slideTimer.stop();

        var dot = event.currentTarget;

        if(dot.slide === this.currentSlide)
        {
            return;
        }

        this.currentSlide.hide();
        this.currentSlide = dot.slide;
        this.currentSlide.show();
        slideTimer.stop();
    };

    this._build();
}

function Slide(node, dot)
{
    this._build = function()
    {
        this.node = node;
        this.dot  = dot;
    };

    this.show = function()
    {
        this.node.style.opacity = 1;
        this.dot.style.background = "#BB494B";
    };

    this.hide = function()
    {
        this.node.style.opacity = 0;
        this.dot.style.background = "#d3d3d3";
    };

    this._build();
}

function SlideTimer()
{
    this._build = function()
    {
        this.interval = setInterval(this._onInterval.bind(this), SLIDE_DELAY);
    };

    this.stop = function()
    {
        clearInterval(this.interval);
    };

    this.restart = function()
    {
        this.stop();
        this.interval = setInterval(this._onInterval.bind(this), SLIDE_DELAY);
    };

    this._onInterval = function()
    {
        slideShow.next();
    };

    this._build();
}

function PageAlign()
{
    this._build = function()
    {
        this.slides     = document.getElementsByClassName("slideshow")[0];
        this.leftImg    = document.querySelector(".projects .left .left-img");
        this.leftArrow  = document.querySelector(".projects .left .arrow");
        this.rightImg   = document.querySelector(".projects .right .right-img");
        this.rightArrow = document.querySelector(".projects .right .arrow");
        window.addEventListener(WINDOW_RESIZE, this._align.bind(this));
    };

    this._align = function()
    {
        var imgTop    = this.slides.offsetTop;
        var imgHeight = this.slides.offsetHeight;
        var arrowTop  = (imgTop + imgHeight) * 0.5;

        this.leftImg.style.opacity   = 0.2;
        this.leftImg.style.top       = imgTop + "px";
        this.leftImg.style.height    = imgHeight + "px";
        this.leftArrow.style.opacity = 1;
        this.leftArrow.style.top     = arrowTop + "px";

        this.rightImg.style.opacity   = 0.2;
        this.rightImg.style.top       = imgTop + "px";
        this.rightImg.style.height    = imgHeight + "px";
        this.rightArrow.style.opacity = 1;
        this.rightArrow.style.top     = arrowTop + "px";

    };

    this._build();
}

