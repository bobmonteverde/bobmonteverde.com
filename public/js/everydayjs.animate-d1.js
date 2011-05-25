// 9b30f8832181e9e91197e95bab3dcec01446539b

/****************************************
 * dailyjs.animate.js
 * Some useful functions to help with jQuery animations.
 *
 * By Bob Monteverde
 * **************************************/

(function($, undefined) {


  if (!$.fn.typeText) $.fn.typeText = function(text, options) {
    if (!options) options = {};
    var $this = $('<span class="typeText"></span>').appendTo(this),
        speed = options.duration ? (options.duration / text.length) : (options.speed || 100),
        type;

    if (options.centered) $this.css({'display': 'inline-block', 'text-align': 'left' , 'width': text.width($this)});

    (type = function(i) {
      $this.html(text.substr(0,i));
      typeof options.eachCallback == 'function' && options.eachCallback();
      
      if (i < text.length)
        window.setTimeout(function(){ type(++i) }, speed);
      else
        typeof options.finalCallback == 'function' && options.finalCallback();
    })(0);
  };


  if (!$.fn.fadeInEach) $.fn.fadeInEach = function(options) {
    if (!options) options = {};
    var set = this,
        speed = options.speed || 500;

    this.eq(0).fadeIn(speed, function(){
      typeof options.eachCallback == 'function' && options.eachCallback();
      (set=set.slice(1)).length && set.fadeInEach(speed);
    });
    
    set.length == 0 && typeof options.finalCallback == 'function' && options.finalCallback();
  };


  if (!$.fn.fadeOutEach) $.fn.fadeOutEach = function(options) {
    if (!options) options = {};
    var set = this,
        speed = options.speed || 500;

    this.eq(0).fadeOut(speed, function(){
      typeof options.eachCallback == 'function' && options.eachCallback();
      (set=set.slice(1)).length && set.fadeOutEach(speed);
    });
    
    set.length == 0 && typeof options.finalCallback == 'function' && options.finalCallback();
  };


})(jQuery);

