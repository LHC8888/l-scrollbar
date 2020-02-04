# l-scrollbar
自定义滚动条，自动在容器内部生成垂直滚动条和水平滚动条。

```
///用法：createScrollbar(option: Object)
createScrollbar({
    container: '.container',
    content: '.content'
});
```

option有以下选项： 

prop | 描述
---|---
container | 内容容器选择器，必传
content | 内容选择器，必传
scrollbarYStyle | 垂直滚动条样式 
sliderYStyle | 垂直滑块样式 
scrollbarXStyle | 水平滚动条样式 
sliderXStyle | 水平滑块样式 
