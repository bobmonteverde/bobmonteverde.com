// 467d73916ecb35c5751128245fcb4c6f2ddcd8ab

/****************************************
 * dailyjs.prototypes.js
 *
 * Some useful common prototypes.
 * Combined from multiple sources
 *
 * By Bob Monteverde (bob@montev.com)
 * **************************************/

(function($, undefined) {


/****************************************
 *           STRING PROTOTYPES
 */

  if (!String.prototype.width) String.prototype.width = function(font, options) {
    var f, o, w;

    if (typeof options == 'undefined') options = {};

    if (typeof font == 'object')
      f = font.css('font-size') + ' ' + font.css('font-family');
    else
      f = font || '12px arial';

    o = String.prototype.width.persisted ||
        $('<div id="dailyjs-stringWidth" />')
         .css({'position': 'absolute', 'float': 'left', 'visibility': 'hidden', 'font': f})
         .appendTo($('body'));

    o.html('<span>' + this + '</span>');
    
    w = o.width();

    if (String.prototype.width.persisted || options.persist)
      String.prototype.width.persisted = o;
    else
      o.remove();

    return w;
  };



  if (!String.prototype.height) String.prototype.height = function(font, width) {
    var f, o, w;

    if (typeof font == 'object')
      f = font.css('font-size') + ' ' + font.css('font-family');
    else
      f = font || '12px arial';
      
    o = $('<div>' + this + '</div>')
         .css({'position': 'absolute', 'float': 'left', 'visibility': 'hidden', 'font': f, 'width': (width ? width : '100%')})
         .appendTo($('body'));
    h = o.height();

    o.remove();
    
    return h;
  };



  if (!String.prototype.shorten) String.prototype.shorten = function(width, font, suffix) {
    var f, s = this;

    if (typeof font == 'object')
      f = font.css('font-size') + ' ' + font.css('font-family');
    else
      f = font || '12px arial';

    while (width < (s + suffix).width(f))
      s = s.substring(0, s.length-1);

    return s + suffix;
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


/****************************************
 *           ARRAY PROTOTYPES
 */



  /**
   * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *
   * array.indexOf(searchElement[, fromIndex])
   *
   * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
   */
  if (!Array.prototype.indexOf)
  {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */)
    {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0)
        return -1;

      var n = 0;
      if (arguments.length > 0)
      {
        n = Number(arguments[1]);
        if (n !== n) // shortcut for verifying if it's NaN
          n = 0;
        //else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))  //WON'T COMPILE ??
        //  n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }

      if (n >= len)
        return -1;

      var k = n >= 0
            ? n
            : Math.max(len - Math.abs(n), 0);

      for (; k < len; k++)
      {
        if (k in t && t[k] === searchElement)
          return k;
      }
      return -1;
    };
  }


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


/****************************************
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


})(jQuery);

