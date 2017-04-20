/**
 * Main entry point into all Java Script.
 * @module Main
 * @requires jquery
 * @requires _core<% if (includeCookie) { %>
 * @requires cookie-info<% } %><% if (includeSocialSharing) { %>
 * @requires social-media-share<% } %>
 * @requires jquery.exists
 * @author <%= HTMLDeveloper %>
 */
require([
  'jquery',
  '_core',
  'jquery.exists'<% if (includeCookie) { %>,
  'cookie-info'<% } %><% if (includeSocialSharing) { %>,
  'social-media-share'<% } %>
], function(
  $,
  _Core,
  exists<% if (includeCookie) { %>,
  CookieInfo<% } %><% if (includeSocialSharing) { %>,
  SocialMediaShare<% } %>
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
      // this.integer = 0;
    },
    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      this._cacheElements();
<% if (includeCookie) { %>      CookieInfo.init();<% } %>
<% if (includeSocialSharing) { %>      SocialMediaShare.init();<% } %>
    }
  };

  Main.init();

});
