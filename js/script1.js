/*******************
 * Settings example:
 * var TITLE = 'Bob Monteverde .com',
 *     MENU = ['home', 'about', 'contact'];
 *******************/

var animate;

(function($, undefined) {

  google.setOnLoadCallback(loadLanguages);
  function loadLanguages() {
    var $translate = $('<div id="translate"><span>Translate: </span></div>').appendTo('body');
        $list = $('<select id="translateLang"></select>').appendTo($translate);
        
    for (lang in google.language.Languages) {
      var translatable = google.language.isTranslatable(google.language.Languages[lang]);
      //console.log(lang, translatable);

      if (translatable) $('<option value="' + google.language.Languages[lang] + '" ' + (lang == 'ENGLISH' ? 'selected' : '') + '>' + lang + '</option>')
        .appendTo($list);
    }
  }

  function translateSite(lang) {
    (function stepSite(set) {
      $this = $(set[0]);
      google.language.translate($this.attr('id'), 'en', lang, function(result) {
        $this.find('.link').html(result.translation);
        set = set.slice(1);
        if (set.length)
          stepSite(set);
        else 
          CURRENTLANG = lang;
      })
    })($('#menu li'));
    $('.menu').css('font-size', ((lang == 'en') ? '28px' : '20px')); //TODO: should calc this based on menu text width
  }

  function translateString(text, obj) {
    if (CURRENTLANG == 'en') obj.html(text);

    google.language.translate(text, 'en', CURRENTLANG, function(result) {
      obj.html(result.translation);
    });
  }


  animate = {
      queue: [],
      current: null,
      next: function(pause) {
        if (typeof pause != 'number') pause = 0;
        animate.current = setTimeout(function() {
          if (animate.queue.length > 0) (animate.queue.shift())();
        }, pause);
      },
      append: function(fun) {
        return animate.queue.push(fun) - 1;
      }
      /*
      // TODO: These are pretty much wrong, at least once animating starts, must rewrite
      remove: function(index) {
        animate.queue.splice(index, 1);
      },
      replace: function(index, fun) {
        animate.queue.splice(index, 1, fun);
      }
      */
  };



  $(document).ready(function() {
    var $heading, $box, $wrapper, $menu, $container;

    $container = $('#container');
    $wrapper = $('#wrapper');
    $heading = $('<div id="heading" class="heading" />').appendTo($wrapper);
    $box = $('<div id="box" class="box" />').appendTo($wrapper);
    $menu = $('<ul id="menu" class="menu" />').appendTo($box);


    $('body').removeClass('ready');

    animate.append(function() { 
      //$heading.css('font-size', TITLE.calcFontSize(400, $heading.css('font-family')));
      $heading.css('width', TITLE.width($heading) + 2 + 'px');
      $heading.typeText(TITLE, { centered: true, finalCallback: animate.next });
    });

    animate.append(function() { 
      $box.animate({
          'width': $heading.css('width')
        }, 
        400, 
        animate.next) 
    });

    animate.append(function() { 
      $container.animate({
        'margin-top': ($box.width() * -.5 -36) + 'px',
        'height': ($box.width() * .8 + 36) + 'px'
      }); 
      $box.animate(
        {'height': $box.width() * .8 + 'px' }, 
        animate.next
      ); 
    });

      
    //$menu.css('font-size', MENU.join(' ').calcFontSize(TITLE.width($heading) * .75, $menu.css('font-family')));

    $.each(MENU, function(index, link) {
      animate.append(function() { 
        var $link = $('<li id="' + link + '"><span class="link">' + link + '</span><div class="contents"></div></li>'),
            w = $heading.html().width($heading);
        
        $link.appendTo($menu);

        //$link.find('.link').animate({'padding-top': w * .8 - $link.html().height($link)}, 1000);
        $link.find('.link').css('padding-top', w * .8 - $link.html().height($link));

        animate.next();
      });
    });
    

    animate.append(changeColor);

    $('<div id="chooseAcolorBox"></div>')
        .appendTo('body');

    $.each(COLORS, function(index, color) {

        animate.append(function() {
          var w = $heading.html().width($heading),
              h = Math.floor(((w * .8) - ((COLORS.length - 1) * 10)) / (COLORS.length)) * 1.4;
          //$('#chooseAcolorBox').css({'width': w + 'px', 'margin-left': (w / -2) + 'px', 'height': (h + 15) + 'px'});
          $('<div class="chooseAcolor ' + color + '"></div>')
              .css({
                'width': h + 'px',
                'height': h + 'px',
                'top': ((index * (h + 10)) + 10) + 'px',
                'left': '10px'
                })
              .appendTo('body')
              .fadeIn(150, function() {
                      animate.next();
                  });
        });

    });

    //setTimeout(animate.next, 500);


    var menuClick = function() {
      var $this = $(this),
          w = $heading.html().width($heading);

      if ($this.hasClass('current')) {
        menuClose();
        return 0;
      }

      animate.append(function() {
        var $contents = $this.find('.contents'),
            //pagename = $this.find('.link').html();
            pagename = $this.attr('id');

        $('body').removeClass('ready');


        $menu.find('.contents').children().fadeOut(250, function() { $(this).remove(); });
        $menu.find('li').not($this).each(function(index, link) {
          $(link).animate({'width': $(link).html().width($('.link')) + 'px'}, 1000);
          $(link).find('.link').animate({'padding-top': w * .8 - $(link).html().height($('.link'))}, 1000);
          $(link).removeClass('current');
        });
        $this.addClass('current');
        $box.animate({'width': 2 * w}, 1000);
        $this.animate({'width': w}, 1000);
        $this.find('.link').animate({'padding-top': '0'}, 1000, function(){
          if ($(this).parents('li').hasClass('current')) {
            $.each(PAGES[pagename], function(index, text) {
                var container = $('<div></div>')
                  .appendTo($contents)
                  .css('display', 'none')
                  .fadeIn(500, function() {
                            $('body').addClass('ready');
                        });
                translateString(text, container);
            });
          }

        });
      });

      animate.next();
      return true;
    };

    var menuClose = function() {
      var w = $heading.html().width($heading);

      animate.append(function() {
        $('body').removeClass('ready');

            //$menu.find('.contents').children().fadeOut(500, function() {
            $menu.find('.contents').children().fadeOut(250, function() { $(this).remove(); });

            $menu.find('li').each(function(index, link){
              $(link).animate({'width': $(link).html().width($('.link')) + 'px'}, 1000);
              $(link).find('.link').animate({'padding-top': w * .8 - $(link).html().height($('.link'))}, 1000);
              $(link).removeClass('current');
            });
            $box.animate({'width': w}, 1000, function() {
                $('body').addClass('ready');
            });
      });

      animate.next();
      return true;
    };

    function changeColor(color) {
      if ($('.container').length > 1) return false;
      COLORS.index = (COLORS.indexOf(color) != -1) ? COLORS.indexOf(color) : (COLORS.index + 1 < COLORS.length) ? COLORS.index + 1 : 0;
      color = COLORS[COLORS.index];

      $('body').removeClass('ready');
      $newcontainer = $container.clone(true);
      $container.removeAttr('id').children().removeAttr('id');

      $.each(COLORS, function(index, color) {
        $newcontainer.removeClass(color);
      });


      //$newcontainer.addClass(COLORS[COLORS.index]);
      $newcontainer.addClass(color);

      $newcontainer
        .appendTo('body')
        .find('.wrapper')
        .css({'display': 'none', 'z-index' : 10000})
        .slideDown(2000, function() {
            $container.remove();

            $container = $newcontainer;
            $wrapper = $container.find('.wrapper');
            $heading = $container.find('.heading');
            $box =  $container.find('.box');
            $menu = $container.find('.menu');

            $('body').addClass('ready');
            animate.next();
        });
    };


    //Binds
    $('#translateLang').live('change', function() {
       translateSite($(this).val());
       menuClose();
    });
    $.each(COLORS, function(index, color) {
       $('.chooseAcolor.' + color).live('click', function(){
          changeColor(color);
       });
    });
    $.each(MENU, function(index, item) {
        $('.ready .' + item).live('click', function() { menuClick.call($('#' + item)); return false; });
    });
    $('.ready #menu').find('li').live('click', menuClick);
    $('.ready #heading').live('click', changeColor);

  });

})(jQuery);
