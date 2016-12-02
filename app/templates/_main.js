/**
 * Main entry point into all Java Script.
 * @module Main
 * @requires jquery
 * @requires jquery.exists
 * @author TODO: add author
 */
require([
  'jquery',
  'jquery.exists'
], function(
  $,
  exists
) {

  'use strict';

  var Main = {
    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    cacheElements: function() {
      // this.$object = $('.class');
      // this.string = 'string';
    },
    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      this.cacheElements();
    }
  };

  Main.init();

});
