;(function(){
    var _option = {}
    var timer;

    function initOption(option, yScrollbar, ySlider, xScrollbar, xSlider){
        if(!option){
            console.error('[l-scrollbar error]: option.container is needed!');
            console.error('[l-scrollbar error]: option.content is needed!');
            return;
        }
        if((yScrollbar && ySlider) || (xScrollbar && xSlider)){
            return;
        }
        var scrollbarYStyle = {
            width: '10px',
            background: '#f0f0f0',
            position: 'absolute',
            top: '0px',
            right: '5px',
            borderRadius: '5px'
        }
        var sliderYStyle = {
            width: '10px',
            background: 'rgb(209,209,209)',
            position: 'absolute',
            borderRadius: '5px',
            top: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            msTransform: 'translateX(-50%)'//不设置的话edge、ie为auto
        }
        var scrollbarXStyle = {
            height: '10px',
            background: '#f0f0f0',
            position: 'absolute',
            left: '0px',
            bottom: '5px',
            borderRadius: '5px'
        }
        var sliderXStyle = {
            height: '10px',
            background: 'rgb(209,209,209)',
            position: 'absolute',
            borderRadius: '5px',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            msTransform: 'translateY(-50%)'//不设置的话edge、ie为auto
        }

        _option.defaultYScrollbarClassName = 'l-scrollbarY';
        _option.defaultYSliderClassName = 'l-sliderY';
        _option.scrollbarYStyle = scrollbarYStyle;
        _option.sliderYStyle = sliderYStyle;
        _option.defaultXScrollbarClassName = 'l-scrollbarX';
        _option.defaultXSliderClassName = 'l-sliderX';
        _option.scrollbarXStyle = scrollbarXStyle;
        _option.sliderXStyle = sliderXStyle;
        _option.wheelStep = 38;
        _option.isCreated = false;

        iterateObj(option, function(op){
            if(Object.prototype.toString.call(_option[op]).indexOf('Object') > -1){
                iterateObj(_option[op], function(prop){
                    if(option[op][prop]){
                        _option[op][prop] = option[op][prop];
                    }
                });
            }else{
                _option[op] = option[op];
            }
        });
    }

    /**
     * 滚动条，水平方向/垂直方向上内容溢出时，自动产生滚动条
     * 滚动条支持自定义样式，鼠标拖动滚动以及滚轮滚动
     * @param option
     *           |container：容器
     *           |content：内容
     *           |scrollbarYStyle：垂直滚动条元素
     *           |sliderYStyle：垂直滑块样式
     *           |scrollbarXStyle：水平滚动条元素
     *           |sliderXStyle：水平滚动条样式
     */
    function createScrollbar(option){
        var containerDOM = document.querySelector(option.container);
        var contentDOM = document.querySelector(option.content);
        var yScrollbar = document.querySelector(option.container + ' .' + _option.defaultYScrollbarClassName);
        var ySlider = document.querySelector(option.container + ' .' + _option.defaultYSliderClassName);
        var xScrollbar = document.querySelector(option.container + ' .' + _option.defaultXScrollbarClassName);
        var xSlider = document.querySelector(option.container + ' .' + _option.defaultXSliderClassName);

        initOption(option, yScrollbar, ySlider, xScrollbar, xSlider);
        initScrollbar(containerDOM, contentDOM, yScrollbar, ySlider, xScrollbar, xSlider);

    }

    ///初始化滚动条
    function initScrollbar(container, content, yScrollbar, ySlider, xScrollbar, xSlider){
        ///垂直  visibleH / contentH = sliderH / scrollbarH
        ///水平  visibleW / contentW = sliderW / scrollbarW
        var containerHeight = container.clientHeight;
        var containerWidth = container.clientWidth;
        var containerPaddingVertical = parseInt(getStyle(container).paddingTop) + parseInt(getStyle(container).paddingBottom);
        var containerPaddingHorizontal = parseInt(getStyle(container).paddingLeft) + parseInt(getStyle(container).paddingRight);
        var visibleHeight = containerHeight - containerPaddingVertical;///垂直方向减去上下内边距得到可视区域的高度
        var visibleWidth = containerWidth - containerPaddingHorizontal;///水平方向
        var contentHeight = content.offsetHeight;///内容的总高度
        var contentWidth = content.offsetWidth;///内容总宽度

        ///垂直滚动条
        if(!yScrollbar && !ySlider && contentHeight > visibleHeight){
            yScrollbar = document.createElement('div');
            yScrollbar.className = _option.defaultYScrollbarClassName;
            ySlider = document.createElement('div');
            ySlider.className = _option.defaultYSliderClassName;

            content.style.top = '0px';
            yScrollbar.style.height = visibleHeight + 'px';
            ySlider.style.height = visibleHeight * visibleHeight / contentHeight + 'px';
    
            iterateObj(_option.scrollbarYStyle, function(style){
                yScrollbar.style[style] = _option.scrollbarYStyle[style];
            });
            iterateObj(_option.sliderYStyle, function(style){
                ySlider.style[style] = _option.sliderYStyle[style];
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

            yScrollbar.appendChild(ySlider);
            container.appendChild(yScrollbar);
            initEventListener(container, content, yScrollbar, ySlider, xScrollbar, xSlider);
        }

        ///水平滚动条
        if(!xScrollbar && !xSlider && contentWidth > visibleWidth){
            xScrollbar = document.createElement('div');
            xScrollbar.className = _option.defaultXScrollbarClassName;
            xSlider = document.createElement('div');
            xSlider.className = _option.defaultXSliderClassName;

            content.style.left = '0px';
            xScrollbar.style.width = visibleWidth + 'px';
            xSlider.style.width = visibleWidth * visibleWidth / contentWidth + 'px';

            iterateObj(_option.scrollbarXStyle, function(style){
                xScrollbar.style[style] = _option.scrollbarXStyle[style];
            });
            iterateObj(_option.sliderXStyle, function(style){
                xSlider.style[style] = _option.sliderXStyle[style];
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

            xScrollbar.appendChild(xSlider);
            container.appendChild(xScrollbar);
            initEventListener(container, content, yScrollbar, ySlider, xScrollbar, xSlider);
        }

    }

    ///注册滚动条的滚轮滚动事件、鼠标点击滚动事件
    function initEventListener(container, content, yScrollbar, ySlider, xScrollbar, xSlider){
        if(yScrollbar && ySlider){
            toggleWheelListener(true, yScrollbar, wheelHandler);
            toggleWheelListener(true, ySlider, wheelHandler);
            toggleWheelListener(true, content, wheelHandler);
        }

        function wheelHandler(ev){
            ev = ev || window.event;

            window.clearTimeout(timer);
            timer = window.setTimeout(function(){
                if(ev.wheelDelta){
                    if (ev.wheelDelta > 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(ySlider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(ySlider).top) - _option.wheelStep, 'y');
                        }else{
                            scrollTo(0, 'y');
                        }
                    }else if(ev.wheelDelta < 0) { //当滑轮向下滚动时
                        if(parseInt(getStyle(ySlider).top) + _option.wheelStep <= parseInt(yScrollbar.clientHeight) - parseInt(ySlider.offsetHeight)){
                            scrollTo(parseInt(getStyle(ySlider).top) + _option.wheelStep, 'y');
                        }else{
                            scrollTo(parseInt(yScrollbar.clientHeight) - parseInt(ySlider.offsetHeight), 'y');
                        }
                    }
                }else if(ev.deltaY){//Firefox滑轮事件，!!!!Firefox兼容
                    if (ev.deltaY < 0) { //当滑轮向上滚动时  
                        if(parseInt(getStyle(ySlider).top) - _option.wheelStep >= 0){
                            scrollTo(parseInt(getStyle(ySlider).top) - _option.wheelStep, 'y');
                        }else{
                            scrollTo(0, 'y');
                        }
                    }else if(ev.deltaY > 0) { //当滑轮向下滚动时
                        if(parseInt(getStyle(ySlider).top) + _option.wheelStep <= parseInt(yScrollbar.clientHeight) - parseInt(ySlider.offsetHeight)){
                            scrollTo(parseInt(getStyle(ySlider).top) + _option.wheelStep, 'y');
                        }else{
                            scrollTo(parseInt(yScrollbar.clientHeight) - parseInt(ySlider.offsetHeight), 'y');
                        }
                    }
                }
            }, 15);

            ev.preventDefault();//ie 滚动穿透
            ev.returnValue = false;//滚动穿透
            return false;//滚动穿透
        }

        ///滚动内容区域和滑块，滑块带动内容区域滑动
        function scrollTo(sliderScrollTo, mode){
            if(mode === 'y'){
                ySlider.style.top = sliderScrollTo + 'px';

                // contentTop / contentH = sliderTop / scrollbarH
                content.style.top = -(sliderScrollTo / yScrollbar.clientHeight * content.offsetHeight) + 'px';
            }
            if(mode === 'x'){
                xSlider.style.left = sliderScrollTo + 'px';
                content.style.left = -(sliderScrollTo / xScrollbar.clientWidth * content.offsetWidth) + 'px';
            }
        }

        //drag slider
        var bodyDOM = document.getElementsByTagName('body')[0];
        var topMouseToScreen = 0;
        var topSliderToScrollbar = 0;
        if(ySlider){
            ySlider.addEventListener('mousedown', function(ev){
                //获得鼠标相对于scrollbar的位置
                topMouseToScreen = ev.screenY;
                topSliderToScrollbar = parseInt(getStyle(ySlider).top);
                bodyDOM.addEventListener('mousemove', mouseYMoving, false);
                bodyDOM.addEventListener('mouseup', function(){
                    bodyDOM.removeEventListener('mousemove', mouseYMoving, false);
                    bodyDOM.onselectstart = new Function();
                    return true;
                }, false);
                bodyDOM.onselectstart = new Function('event.returnValue=false;');
                return false;
            }, false);
        }

        function mouseYMoving(ev){
            var topMoving = ev.screenY - topMouseToScreen;
            if(topSliderToScrollbar + topMoving >= 0 && topSliderToScrollbar + topMoving <= parseInt(yScrollbar.clientHeight) - parseInt(ySlider.offsetHeight)){
                scrollTo(topSliderToScrollbar + topMoving, 'y');
            }
            return false;
        }

        var leftMouseToScreen = 0;
        var leftSliderToScrollbar = 0;
        if(xSlider){
            xSlider.addEventListener('mousedown', function(ev){
                leftMouseToScreen = ev.screenX;
                leftSliderToScrollbar = parseInt(getStyle(xSlider).left);
                bodyDOM.addEventListener('mousemove', mouseXMoving, false);
                bodyDOM.addEventListener('mouseup', function(){
                    bodyDOM.removeEventListener('mousemove', mouseXMoving, false);
                    bodyDOM.onselectstart = new Function();
                    return false;
                }, false);
                bodyDOM.onselectstart = new Function('event.returnValue=false');
                return false;
            }, false);
    
        }

        function mouseXMoving(ev){
            var leftMoving = ev.screenX - leftMouseToScreen;
            if(leftSliderToScrollbar + leftMoving >= 0 && leftSliderToScrollbar + leftMoving <= parseInt(xScrollbar.clientWidth) - parseInt(xSlider.offsetWidth)){
                scrollTo(leftSliderToScrollbar + leftMoving, 'x');
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