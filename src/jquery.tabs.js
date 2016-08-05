;(function($, window, undefined){
    'use strict';
    $.fn.tabs = function(options){

        var defaults = {
            mouseEvent: 'click',        // 默认为鼠标触发
            active: 0,                  // 默认激活的tab, 从0开始计数
            animation: false,           // 默认切换之间不适用动画
            animateDuration: 1000,      // 默认动画时间1s
            activeClass: 'active',      // 默认的激活类
            autoplay: false,            // 默认不自动切换
            autoplayDelay: 2000,        // 默认自动切换时的时间间隔2s
            pauseHover: true,           // 默认当鼠标悬停时停止切换，离开后继续切换
            control: false,             // 默认的前后控制选择器
            prevSelector: '.prev',      // 默认向前切换按钮的选择器
            nextSelector: '.next'       // 默认向后切换按钮的选择器
        };

        var settings = $.extend(defaults, options);
        settings.mouseEvent = settings.mouseEvent === 'hover' ? 'mouseenter' : 'click';

        this.each(function(i, ele) {
            var $heading = $(ele).find('.tabs-heading');
            var $body = $(ele).find('.tabs-body');
            var $hlis = $heading.children('li');
            var $blis = $body.children('div');
            var len = $hlis.length;
            var timer = null;
            var curActive = settings.active;    // 必须放在each内

            $heading.css('display', 'inline-block');

            // 初始化显示
            $hlis.eq(curActive).addClass(settings.activeClass);
            $blis.eq(curActive).show();

            $heading.on('mouseenter', function(e) {
                clearInterval(timer);
            });

            $heading.on('mouseleave', function(e) {
                if(!settings.autoplay){
                    return false;
                }
                timer = setInterval(function(){
                    curActive++;
                    curActive = curActive >= len ? 0 : curActive;
                    $hlis.eq(curActive).trigger(settings.mouseEvent+'.tabs');   // 事件命名空间的妙用
                }, settings.autoplayDelay);
            });

            // 切换执行事件
            $hlis.on(settings.mouseEvent+'.tabs', function(e) {
                e.preventDefault();

                var index = curActive = $hlis.index($(this));
                $hlis.removeClass(settings.activeClass);
                $(this).addClass(settings.activeClass);
                $blis.hide();

                if (settings.animation) {
                    $blis.eq(index).animate({opacity: 'show'}, settings.animateDuration);
                }else{
                    $blis.eq(index).show();
                }
            });

            // 初始化，如果设置自动切换，则启动定时器
            if (settings.autoplay) {
                $heading.trigger('mouseleave'); // 先绑定事件,后触发
            };

            if (settings.control) {
                var $prev = $(ele).find(settings.prevSelector);
                var $next = $(ele).find(settings.nextSelector);

                $next.on('mouseenter', function(e){
                    if (! settings.autoplay) {
                        return false;
                    }
                    clearInterval(timer);
                });

                $prev.on('mouseenter', function(e){
                    if (! settings.autoplay) {
                        return false;
                    }
                    clearInterval(timer);
                });

                $next.on('click', function(e) {
                    curActive++;
                    curActive = curActive >= len ? 0 : curActive;
                    $hlis.eq(curActive).trigger(settings.mouseEvent+'.tabs');
                });

                $prev.on('click', function(e) {
                    curActive--;
                    curActive = curActive < 0 ? len-1 :curActive;
                    $hlis.eq(curActive).trigger(settings.mouseEvent+'.tabs');
                });

                $next.on('mouseleave', function(e){
                    if (! settings.autoplay) {
                        return false;
                    }
                    $heading.trigger('mouseleave');
                });

                $prev.on('mouseleave', function(e){
                    if (! settings.autoplay) {
                        return false;
                    }
                    $heading.trigger('mouseleave');
                });
            }
        });
        return this;
    };
})(jQuery, window);