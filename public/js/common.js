
(function($, undefined) {

/******************************************************
 *           STRING PROTOTYPES
 */

  if (!String.prototype.width) String.prototype.width = function(font) {
    var f, o, w;

    if (typeof font == 'object')
      f = font.css('font-size') + ' ' + font.css('font-family');
    else
      f = font || '12px arial';
      
    o = $('<div>' + this + '</div>')
         .css({'position': 'absolute', 'float': 'left', 'visibility': 'hidden', 'font': f})
         .appendTo($('body')),
    w = o.width();

    o.remove();

    return w;
  }


  if (!String.prototype.shorten) String.prototype.shorten = function(width, font) {
    var f = font || '12px arial',
        s = this;

    while (width < s.width(f))
      s = s.substring(0, s.length-1);

    return s;
  };


  if (!String.prototype.calcFontSize) String.prototype.calcFontSize = function(width, fontFamily) {
    var f = fontFamily || 'arial',
        o = $('<div>' + this + '</div>')
              .css({'position': 'absolute', 'float': 'left', 'visibility': 'hidden', 'font-family': f})
              .appendTo($('body')),
        re = /^(\d+)(\D*)$/,
        fontSize, newSize;

    while (o.width() < width) { 
      fontSize = o.css('font-size').match(re);
      newSize = (parseFloat(fontSize[1]) + .5) + fontSize[2];
      o.css('font-size', newSize);
    }

    return newSize;
  };





/******************************************************
 *           ARRAY PROTOTYPES
 */

  /**
   * Creates a new array with the results of calling a provided function on every
   * element in this array. Implemented in Javascript 1.6.
   *
   * @function
   * @name Array.prototype.map
   * @see <a
   * href="https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/Map">map</a>
   * documentation.
   * @param {function} f function that produces an element of the new Array from
   * an element of the current one.
   * @param [o] object to use as <tt>this</tt> when executing <tt>f</tt>.
   */
  if (!Array.prototype.map) Array.prototype.map = function(f, o) {
    var n = this.length;
    var result = new Array(n);
    for (var i = 0; i < n; i++) {
      if (i in this) {
        result[i] = f.call(o, this[i], i, this);
      }
    }
    return result;
  };


  /**
   * Creates a new array with all elements that pass the test implemented by the
   * provided function. Implemented in Javascript 1.6.
   *
   * @function
   * @name Array.prototype.filter
   * @see <a
   * href="https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/filter">filter</a>
   * documentation.
   * @param {function} f function to test each element of the array.
   * @param [o] object to use as <tt>this</tt> when executing <tt>f</tt>.
   */
  if (!Array.prototype.filter) Array.prototype.filter = function(f, o) {
    var n = this.length;
    var result = new Array();
    for (var i = 0; i < n; i++) {
      if (i in this) {
        var v = this[i];
        if (f.call(o, v, i, this)) result.push(v);
      }
    }
    return result;
  };


  /**
   * Executes a provided function once per array element. Implemented in
   * Javascript 1.6.
   *
   * @function
   * @name Array.prototype.forEach
   * @see <a
   * href="https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/ForEach">forEach</a>
   * documentation.
   * @param {function} f function to execute for each element.
   * @param [o] object to use as <tt>this</tt> when executing <tt>f</tt>.
   */
  if (!Array.prototype.forEach) Array.prototype.forEach = function(f, o) {
    var n = this.length >>> 0;
    for (var i = 0; i < n; i++) {
      if (i in this) f.call(o, this[i], i, this);
    }
  };


  /**
   * Apply a function against an accumulator and each value of the array (from
   * left-to-right) as to reduce it to a single value. Implemented in Javascript
   * 1.8.
   *
   * @function
   * @name Array.prototype.reduce
   * @see <a
   * href="https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/Reduce">reduce</a>
   * documentation.
   * @param {function} f function to execute on each value in the array.
   * @param [v] object to use as the first argument to the first call of
   * <tt>t</tt>.
   */
  if (!Array.prototype.reduce) Array.prototype.reduce = function(f, v) {
    var len = this.length;
    if (!len && (arguments.length == 1)) {
      throw new Error("reduce: empty array, no initial value");
    }

    var i = 0;
    if (arguments.length < 2) {
      while (true) {
        if (i in this) {
          v = this[i++];
          break;
        }
        if (++i >= len) {
          throw new Error("reduce: no values, no initial value");
        }
      }
    }

    for (; i < len; i++) {
      if (i in this) {
        v = f(v, this[i], i, this);
      }
    }
    return v;
  };


  if (!Array.prototype.has) Array.prototype.has = function(v) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == v) return true;
    }
    return false;
  };


  // http://www.martienus.com/code/javascript-remove-duplicates-from-array.html
  if (!Array.prototype.unique) Array.prototype.unique = function() {
    var r = new Array();
    o: for (var i = 0, n = this.length; i < n; i++)
    {
        for (var x = 0, y = r.length; x < y; x++)
        {
            if (r[x] == this[i])
            {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
  };




/******************************************************
 *           FUNCTION PROTOTYPES
 */
  
  if (!Function.prototype.memoized) Function.prototype.memoized = function(key){
    this._values = this._values || {};
    return this._values[key] !== undefined ?
      this._values[key] :
      this._values[key] = this.apply(this, arguments);
  };

  if (!Function.prototype.memoize) Function.prototype.memoize = function(){
    var fn = this;
    return function(){
      return fn.memoized.apply( fn, arguments );
    };
  };




/******************************************************
 *           JQUERY OBJECT PROTOTYPES
 */

  $.fn.typeText = function(text, speed, charCallback, stringCallback) {
    var $this = $(this),
        type;

    speed = speed || 100; 

    (type = function(i) {
      $this.html(text.substr(0,i));
      typeof charCallback == 'function' && charCallback();
      
      if (i < text.length)
        window.setTimeout(function(){ type(++i) }, speed);
      else
        typeof stringCallback == 'function' && stringCallback();
    })(0);
  };

  $.fn.fadeInEach = function(speed, callback){
    var set = this;

    this.eq(0).fadeIn(speed, function(){
      (set=set.slice(1)).length && set.fadeInEach(speed);
    });
    
    if (set.length == 0 && typeof callback == 'function')
      callback();
  };

})(jQuery);
