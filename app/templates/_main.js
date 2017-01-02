/**
 * Main entry point into all Java Script.
 * @module Main
 * @requires jquery
 * @requires jquery.exists
 * @author TODO: add author
 */
require([
  'jquery',
  '_core',
  'jquery.exists'
], function(
  $,
  _Core,
  exists
) {

  'use strict';

  var Main = {
    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      // this.$object = $('.class');
      // this.string = 'string';
    },
    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      this._cacheElements();
    }
  };

  Main.init();

});
