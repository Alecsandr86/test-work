$(function () {

    /**
     * menu ajax
     * ================================= */

    if (window.location.hash) {
        var hash = window.location.hash;
        var page = $(hash).attr('href');
        $(".menu-down").load(page);
    }
    $('.menu__item').hover(
        function (event) {
            var w = $(window).width();
            if(w > 1010){
                var $this = $(this).find("a[id*=page]");
                $this.next(".menu-down").fadeToggle(500);

                var href = $this.attr('href');
                var hash = $this.attr('id');
                $.ajax({
                    url    : href,
                    success: function (data) {
                        $this.next(".menu-down").html(data);
                        window.location.hash = hash;
                    }
                });
                event.stopPropagation();
                return false;
            }

        }, function () {
            var w = $(window).width();
            if (w > 1010) {
                var $this = $(this).find("a[id*=page]");
                $this.next(".menu-down").fadeToggle(0);
            }
        });

    /**
     * burger
     * ================================= */

    $('#nav-icon1').click(function(){
        $(this).toggleClass('open');
        $(this).next(".menu").fadeToggle();
    });


    /**
     * carosel
     * ================================= */

    $(document).on('click', ".carousel-button-right", function () {
        var carusel = $(this).parents('.carousel');
        right_carusel(carusel);
        return false;
    });

    $(document).on('click', ".carousel-button-left", function () {
        var carusel = $(this).parents('.carousel');
        left_carusel(carusel);
        return false;
    });
    function left_carusel(carusel) {
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items .carousel-block").eq(-1).clone().prependTo($(carusel).find(".carousel-items"));
        $(carusel).find(".carousel-items").css({"left": "-" + block_width + "px"});
        $(carusel).find(".carousel-items .carousel-block").eq(-1).remove();
        $(carusel).find(".carousel-items").animate({left: "0px"}, 200);

    }

    function right_carusel(carusel) {
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items").animate({left: "-" + block_width + "px"}, 200, function () {
            $(carusel).find(".carousel-items .carousel-block").eq(0).clone().appendTo($(carusel).find(".carousel-items"));
            $(carusel).find(".carousel-items .carousel-block").eq(0).remove();
            $(carusel).find(".carousel-items").css({"left": "0px"});
        });
    }

    $(function () {
        auto_right('.carousel:first');
    });

    function auto_right(carusel) {
        setInterval(function () {
            if (!$(carusel).is('.hover'))
                right_carusel(carusel);
        }, 3000)
    }


    $(document).on('mouseenter', '.carousel', function () {
        $(this).addClass('hover')
    });
    $(document).on('mouseleave', '.carousel', function () {
        $(this).removeClass('hover')
    });


});

/**
 * ------------------------------------------------------------------------
 * Window Loader
 * ------------------------------------------------------------------------
 */

var $elemLoader = $('.loader-box,.loader');

$elemLoader.fadeIn(10);

$(window).on("load", function () {
    $elemLoader.fadeOut(500);
});



$(window).on("resize", function () {
    $(".menu").removeAttr("style");
});

/**
 * tabs JavaScript
 * ================================= */

(function() {

    'use strict';

    var tabs = function(options) {

        var el = document.querySelector(options.el);
        var tabNavigationLinks = el.querySelectorAll(options.tabNavigationLinks);
        var tabContentContainers = el.querySelectorAll(options.tabContentContainers);
        var activeIndex = 0;
        var initCalled = false;

        var init = function() {
            if (!initCalled) {
                initCalled = true;

                for (var i = 0; i < tabNavigationLinks.length; i++) {
                    var link = tabNavigationLinks[i];
                    handleClick(link, i);
                }
            }
        };

        var handleClick = function(link, index) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                goToTab(index);
            });
        };

        var goToTab = function(index) {
            if (index !== activeIndex && index >= 0 && index <= tabNavigationLinks.length) {
                tabNavigationLinks[activeIndex].classList.remove('active');
                tabNavigationLinks[index].classList.add('active');
                tabContentContainers[activeIndex].classList.remove('active');
                tabContentContainers[index].classList.add('active');
                activeIndex = index;
            }
        };

        return {
            init: init,
            goToTab: goToTab
        };

    };

    window.tabs = tabs;

})();



var product = tabs({
    el: '#tab-tov',
    tabNavigationLinks: '.tov-nav__link',
    tabContentContainers: '.tab-tov__item '
});

var myTabs = tabs({
    el: '#tabs',
    tabNavigationLinks: '.tabs-nav__item',
    tabContentContainers: '.tabs-cont__item'
});

product.init();

myTabs.init();






