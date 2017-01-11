
var SLIDE_DELAY = 5000;
var slideShow   = new SlideShow();
var slideTimer  = new SlideTimer();


function SlideShow()
{

    this._build = function()
    {
        this.node   = document.getElementsByClassName("slideshow")[0];
        this.slides = this._createSlides();
        setTimeout(this._init.bind(this), 1);
    };

    this._init = function()
    {
        this._align();
        this.node.style.opacity = 1;
        this.currentSlide = this.slides[0];
        this.currentSlide.show();
        window.addEventListener(WINDOW_RESIZE, this._align.bind(this));
    };

    this._createSlides = function()
    {
        var slides = [];

        for(var i=0; i<this.node.childNodes.length; i++)
        {
            var child = this.node.childNodes[i];
            var slide = new Slide(child);
            slides.push(slide);
        }

        return slides;
    };

    this._align = function()
    {
        var clazz  = displayMobile ? "header-mobile" : "header";
        var header = document.getElementsByClassName(clazz)[0];
        var width  = window.innerWidth + "px";
        var height = window.innerHeight - header.offsetHeight + "px";

        if(height !== this.node.style.height || width !== this.node.style.width)
        {
            this.node.style.width  = width;
            this.node.style.height = height;

            for(var i=0; i<this.slides.length; i++)
            {
                this.slides[i].align();
            }
        }
    };

    this.next = function()
    {
        this.currentSlide.hide();
        this.currentSlide = this.slides[this.slides.indexOf(this.currentSlide) + 1] ||
                            this.slides[0];
        this.currentSlide.show();
    };

    this._build();
}

function Slide(node)
{
    this._build = function()
    {
        this.node       = node;
        this.img        = this.node.getElementsByTagName("img")[0];
        this.loader     = this.node.getElementsByClassName("loader")[0];
        this.image      = this.node.getElementsByClassName("image")[0];
        this.title      = this.node.getElementsByClassName("title")[0];
        this.img.onload = this._onImgLoaded.bind(this);
    };

    this._onImgLoaded = function()
    {
        this.image.style.backgroundImage = "url('" + this.img.src + "')";
    };

    this.show = function()
    {
        // ios fix for failed backgroundImage loads
        if(!this.image.style.backgroundImage)
        {
            this._onImgLoaded();
        }

        this.node.style.opacity = 1;
    };

    this.hide = function()
    {
        this.node.style.opacity = 0;
    };

    this.align = function()
    {
        this.node.style.width  = slideShow.node.offsetWidth  + "px";
        this.node.style.height = slideShow.node.offsetHeight + "px";
    };

    this._build();
}

function SlideTimer()
{
    this._build = function()
    {
        setInterval(this._onInterval.bind(this), SLIDE_DELAY);
    };

    this._onInterval = function()
    {
        slideShow.next();
    };

    this._build();
}
