;(function(){

    //滚动条、滑块类名、默认样式
    var scrollbarClassName = 'l-scrollbar';
    var sliderClassName = 'l-slider';
    var scrollbarStyle = {
        width: '10px',
        color: '#f0f0f0',
        position: 'absolute',
        top: '5px',
        right: '5px',
        borderRadius: '5px'
    }
    var sliderStyle = {
        width: '10px',
        color: 'rgb(209,209,209)',
        position: 'absolute',
        borderRadius: '5px',
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)'
    }

    var _option = {};

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
        _option = option;
        _option.wheelStep = option.wheelStep || 23;

        var containerDOM = document.querySelector(option.container);
        var contentDOM = document.querySelector(option.content);

        var scrollbar = document.createElement('div');
        scrollbar.className = scrollbarClassName;
        var slider = document.createElement('div');
        slider.className = sliderClassName;
        scrollbar.appendChild(slider);

        initSize(containerDOM, contentDOM, scrollbar, slider);

        containerDOM.appendChild(scrollbar);

        initEventListener(containerDOM, contentDOM, scrollbar, slider);
    }

    ///初始化滚动条的尺寸
    function initSize(container, content, scrollbar, slider){
        //  visibleH / contentH = sliderH / scrollbarH
        var containerHeight = container.clientHeight;
        var containerPadding = parseInt(getStyle(container).paddingTop) + parseInt(getStyle(container).paddingBottom);
        var visibleHeight = containerHeight - containerPadding;///减去上下内边距得到可是区域的高度
        var contentHeight = content.offsetHeight;//内容的总高度

        scrollbar.style.height = visibleHeight + 'px';
        scrollbar.style.width = scrollbarStyle.width;
        scrollbar.style.background = scrollbarStyle.color;
        scrollbar.style.position = scrollbarStyle.position;
        scrollbar.style.top = scrollbarStyle.top;
        scrollbar.style.right = scrollbarStyle.right;
        scrollbar.style.borderRadius = scrollbarStyle.borderRadius;
        slider.style.height = visibleHeight * visibleHeight / contentHeight + 'px';
        slider.style.width = sliderStyle.width;
        slider.style.background = sliderStyle.color;
        slider.style.position = sliderStyle.position;
        slider.style.borderRadius = sliderStyle.borderRadius;
        slider.style.left = sliderStyle.left;
        slider.style.transform = sliderStyle.transform;
        slider.style.top = sliderStyle.top;//不设置的话edge、ie为auto

        if(getStyle(container).position === 'static'){
            container.style.position = 'relative';
        }
        if(getStyle(content).position === 'static'){
            content.style.position = 'relative';
        }
    }

    ///注册滚动条的滚轮滚动事件、鼠标点击滚动事件
    function initEventListener(container, content, scrollbar, slider){
        toggleWheelListener(true, content, wheelHandler);
        toggleWheelListener(true, scrollbar, wheelHandler);
        toggleWheelListener(true, slider, wheelHandler);
        

        var timer;
        function wheelHandler(ev){
            console.log(ev);
            ev = ev || window.event;
            window.clearTimeout(timer);
            timer = window.setTimeout(function(){
                console.log(ev.target.className);
                if(ev.wheelDelta){
                    if (ev.wheelDelta > 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(slider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(slider).top) - _option.wheelStep);
                        }else{
                            scrollTo(0);
                        }
                        console.log("滑轮向上滚动");  
                    }else if(ev.wheelDelta < 0) { //当滑轮向下滚动时  
                        if(parseInt(getStyle(slider).top) + _option.wheelStep <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                            scrollTo(parseInt(getStyle(slider).top) + _option.wheelStep);
                        }else{
                            scrollTo(parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight));
                        }
                        console.log("滑轮向下滚动");  
                    }  
                }else if(ev.deltaY){//Firefox滑轮事件，!!!!Firefox兼容
                    if (ev.deltaY < 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(slider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(slider).top) - _option.wheelStep);
                        }else{
                            scrollTo(0);
                        }
                        console.log("滑轮向上滚动");  
                    }else if(ev.deltaY > 0) { //当滑轮向下滚动时  
                        if(parseInt(getStyle(slider).top) + _option.wheelStep <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                            scrollTo(parseInt(getStyle(slider).top) + _option.wheelStep);
                        }else{
                            scrollTo(parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight));
                        }
                        console.log("滑轮向下滚动");  
                    }  
                }
            }, 15);
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
        var mouseTimer;
        slider.addEventListener('mousedown', function(ev){
            //获得鼠标相对于scrollbar的位置
            topMouseToScreen = ev.screenY;
            console.log(getStyle(slider).top);
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
            window.clearTimeout(mouseTimer);
            mouseTimer = window.setTimeout(function(){
                var topMoving = ev.screenY - topMouseToScreen;
                if(topSliderToScrollbar + topMoving >= 0 && topSliderToScrollbar + topMoving <= parseInt(scrollbar.clientHeight) - parseInt(slider.offsetHeight)){
                    scrollTo(topSliderToScrollbar + topMoving);
                }
            }, 0);
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

    window.createScrollbar = createScrollbar;

})();