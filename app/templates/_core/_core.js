/**
 * A collection of useful JavaScript tools you might need on your way through the dangerous world of scripting
 * @module Core
 * @requires jquery
 * @author webit! Gesellschaft für nue Medien mbH
 */
define(['jquery'], function($) {

  'use strict';

  var Core = {
    /**
     * Window selector
     * @public
     * @alias module:Core.$window
     * @type {$object}
     */
    $window: $(window),

    /**
     * Document selector
     * @public
     * @alias module:Core.$document
     * @type {$object}
     */
    $document: $(document),

    /**
    * html selector
    * @public
    * @alias module:Core.$html
    * @type {$object}
    */
    $html: $('html'),

    /**
     * Body selector
     * @public
     * @alias module:Core.$body
     * @type {$object}
     */
    $body: $('body'),

    /**
     * Debounce a specified function to avoid multiple unnecessary calls.
     * https://remysharp.com/2010/07/21/throttling-function-calls
     * @function debounce
     * @public
     * @param {function} func - The function that should be executed with a debounce
     * @param {number} delay - Time in milliseconds until the function will be fired; default: 250
     * @param {string} - The context of the fired function; default: this
     * @return {function}
     * @example
     * $('input.username').keypress(Core.debounce(function (event) {
     *   // do the Ajax request
     * }, 250));
     */
    debounce: function (func, delay, scope) {
      var timer = null;

      delay = delay || 250;
      return function () {
        var context = scope || this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(context, args);
        }, delay);
      };
    },

    /**
     * Get HTML-FontFamily for current viewport.
     * @function getMediaquery
     * @public
     * @returns {string} mediaquery - current css font-family at the html element that specifies the screen size
     */
    getMediaquery: function() {
      var
      mediaquery,
      regex = /['",]/g;

      // Font-Family on html is set for Mediaquery
      if (document.documentElement.currentStyle) {
        mediaquery = document.documentElement.currentStyle.fontFamily;
      }

      // for Firefox: document.documentElement.currentStyle not working
      if (window.getComputedStyle) {
        mediaquery = window.getComputedStyle(document.documentElement, null).getPropertyValue('font-family');
      }

      mediaquery = mediaquery.replace(regex, '');

      return mediaquery;
    }
  };

  return /** @alias module:Core */ {
    /** debounce */
    debounce: Core.debounce,
    /** getMediaquery */
    getMediaquery: Core.getMediaquery,
    /** $window */
    $window: Core.$window,
    /** $document */
    $document: Core.$document,
    /** $html */
    $html: Core.$html,
    /** $body */
    $body: Core.$body
  };

});
