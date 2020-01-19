;(function(){
    var _option = {}
    var timer;

    function initOption(option){
        if(!option){
            return;
        }
        var scrollbarStyle = {
            width: '10px',
            background: '#f0f0f0',
            position: 'absolute',
            top: '0px',
            right: '5px',
            borderRadius: '5px'
        }
        var sliderStyle = {
            width: '10px',
            background: 'rgb(209,209,209)',
            position: 'absolute',
            borderRadius: '5px',
            top: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            msTransform: 'translateX(-50%)'//不设置的话edge、ie为auto
        }

        _option = {};
        _option.defaultScrollbarClassName = 'l-scrollbar';
        _option.defaultSliderClassName = 'l-slider';
        _option.scrollbarStyle = scrollbarStyle;
        _option.sliderStyle = sliderStyle;
        _option.wheelStep = 38;
        _option.mode = 'y';//y-竖滚动条 x-横向滚动条
        _option.isCreated = false;

        iterateObj(option, function(op){
            _option[op] = option[op];
        });
    }

    /**
     * @param option
     *           |container：容器
     *           |content：内容
     *           |scrollbar：滚动条元素
     *           |scrollbar：滚动条样式
     *           |slider：滚动条滑块样式
     *           |mode:横向、纵向
     */
    function createScrollbar(option){
        initOption(option);

        var containerDOM = document.querySelector(option.container);
        var contentDOM = document.querySelector(option.content);
        var scrollbar = document.querySelector('.' + _option.defaultScrollbarClassName);
        var slider = document.querySelector('.' + _option.defaultSliderClassName);

        if(!scrollbar && !slider){
            scrollbar = document.createElement('div');
            scrollbar.className = _option.defaultScrollbarClassName;
            slider = document.createElement('div');
            slider.className = _option.defaultSliderClassName;
        }

        var isNeedScrollbar = initStyle(containerDOM, contentDOM, scrollbar, slider);

        if(isNeedScrollbar && !_option.isCreated){
            scrollbar.appendChild(slider);
            containerDOM.appendChild(scrollbar);
            _option.isCreated = true;
        }

        initEventListener(containerDOM, contentDOM, scrollbar, slider);
    }

    ///初始化滚动条的尺寸
    function initStyle(container, content, scrollbar, slider){
        //  visibleH / contentH = sliderH / scrollbarH
        var containerHeight = container.clientHeight;
        var containerPadding = parseInt(getStyle(container).paddingTop) + parseInt(getStyle(container).paddingBottom);
        var visibleHeight = containerHeight - containerPadding;///减去上下内边距得到可是区域的高度
        var contentHeight = content.offsetHeight;//内容的总高度

        if(contentHeight <= visibleHeight){
            return false;
        }

        content.style.top = '0px';
        scrollbar.style.height = visibleHeight + 'px';
        slider.style.height = visibleHeight * visibleHeight / contentHeight + 'px';

        iterateObj(_option.scrollbarStyle, function(style){
            scrollbar.style[style] = _option.scrollbarStyle[style];
        });
        iterateObj(_option.sliderStyle, function(style){
            slider.style[style] = _option.sliderStyle[style];
        });

        if(getStyle(container).position === 'static'){
            container.style.position = 'relative';
        }
        if(getStyle(content).position === 'static'){
            content.style.position = 'relative';
        }
        if(getStyle(container).overflow !== 'hidden'){
            container.style.overflow = 'hidden';
        }

        return true;
    }

    ///注册滚动条的滚轮滚动事件、鼠标点击滚动事件
    function initEventListener(container, content, scrollbar, slider){
        toggleWheelListener(true, content, wheelHandler);
        toggleWheelListener(true, scrollbar, wheelHandler);
        toggleWheelListener(true, slider, wheelHandler);


        function wheelHandler(ev){
            ev = ev || window.event;

            window.clearTimeout(timer);
            timer = window.setTimeout(function(){
                if(ev.wheelDelta){
                    if (ev.wheelDelta > 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(slider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(slider).top) - _option.wheelStep);
                        }else{
                            scrollTo(0);
                        }
                    }else if(ev.wheelDelta < 0) { //当滑轮向下滚动时
                        if(parseInt(getStyle(slider).top) + _option.wheelStep <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                            scrollTo(parseInt(getStyle(slider).top) + _option.wheelStep);
                        }else{
                            scrollTo(parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight));
                        }
                    }
                }else if(ev.deltaY){//Firefox滑轮事件，!!!!Firefox兼容
                    if (ev.deltaY < 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(slider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(slider).top) - _option.wheelStep);
                        }else{
                            scrollTo(0);
                        }
                    }else if(ev.deltaY > 0) { //当滑轮向下滚动时
                        if(parseInt(getStyle(slider).top) + _option.wheelStep <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                            scrollTo(parseInt(getStyle(slider).top) + _option.wheelStep);
                        }else{
                            scrollTo(parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight));
                        }
                    }
                }
            }, 15);

            ev.returnValue = false;//滚动穿透
            return false;//滚动穿透
        }

        ///滚动内容区域和滑块，滑块带动内容区域滑动
        function scrollTo(sliderScrollTo){
            slider.style.top = sliderScrollTo + 'px';

            // contentTop / contentH = sliderTop / scrollbarH
            content.style.top = -(sliderScrollTo / scrollbar.clientHeight * content.offsetHeight) + 'px';
        }

        //drag slider
        var topMouseToScreen = 0;
        var topSliderToScrollbar = 0;
        slider.addEventListener('mousedown', function(ev){
            //获得鼠标相对于scrollbar的位置
            topMouseToScreen = ev.screenY;
            topSliderToScrollbar = parseInt(getStyle(slider).top);
            document.getElementsByTagName('body')[0].addEventListener('mousemove', mouseMoving, false);
            document.getElementsByTagName('body')[0].addEventListener('mouseup', function(){
                document.getElementsByTagName('body')[0].removeEventListener('mousemove', mouseMoving, false);
                document.getElementsByTagName('body')[0].onselectstart = new Function();
                return true;
            }, false);
            document.getElementsByTagName('body')[0].onselectstart = new Function('event.returnValue=false;');
            return false;
        }, false);

        function mouseMoving(ev){
            var topMoving = ev.screenY - topMouseToScreen;
            if(topSliderToScrollbar + topMoving >= 0 && topSliderToScrollbar + topMoving <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                scrollTo(topSliderToScrollbar + topMoving);
            }
            return false;
        }

    }

    function getStyle(el){
        return window.getComputedStyle(el, null);
    }

    function toggleWheelListener(flag, el, foo){
        var support = "onwheel" in document.createElement("div") ? "wheel" : // 各个厂商的高版本浏览器都支持"wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit 和 IE一定支持"mousewheel"
              "DOMMouseScroll"; // 低版本firefox
        if(flag){
            el.addEventListener(support, foo, false);
        }else{
            el.removeEventListener(support, foo, false);
        }
    }

    function iterateObj(obj, callback){
        for(var prop in obj){
            if (obj.hasOwnProperty(prop)){
                callback && callback(prop);
            }
        }
    }

    window.createScrollbar = createScrollbar;

})();