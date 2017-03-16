/**
 * Save Cookie when accepting the terms from the cookie-info.
 * the script requires the lib cookie.js from markusfalk, 'bower install markusfalk/cookie --save'
 * @module CookieInfo
 * @requires jquery
 * @requires jquery.exists
 * @requires cookie
 * @author Christian Schramm / André Meier da Silva
 */
define([
  'jquery',
  '_core',
  'jquery.exists',
  'cookie'
], function(
  $,
  _Core,
  exists,
  Cookie
) {

  'use strict';

  var CookieInfo = {

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$cookie_info = _Core.$body.find('.cookie-info');
      this.$cookie_button = this.$cookie_info.find('.cookie-accept');

      this.accept_cookies = true;
      this.cookie_expiration_time = 365; // days
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      CookieInfo._cacheElements();

      CookieInfo.$cookie_info.exists(function() {
        CookieInfo._checkCookie();
      });
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {
      CookieInfo.$cookie_button.on('click', function (event) {
        CookieInfo._hideCookieInfo();
        CookieInfo._writeCookie(accept_cookies);
      });
    },

    /**
     * Check if Cookies are available and isn't set to true.
     * @function _checkCookie
     * @private
     */
    _checkCookie: function() {
      if((navigator.cookieEnabled)) {
        if (Cookie.read('cookiesAccepted') !== 'true') {
          CookieInfo._writeCookie(!accept_cookies);
          CookieInfo.$cookie_info.slideDown();
          CookieInfo._bindEvents();
        }
      }
      else {
        /** Add Class no-cookies to the HTML tag if Cookies aren't enabled */
        _Core.$html.addClass('no-cookies');
      }
    },

    /**
     * Write Cookie.
     * @function _checkCookie
     * @private
     */
    _writeCookie: function(value) {
      Cookie.create('cookiesAccepted', value, cookie_expiration_time);
    },

    /**
     * Hide CookieInfo if Cookieterm is accepted.
     * @function _hideCookieInfo
     * @private
     */
    _hideCookieInfo: function() {
      CookieInfo.$cookie_info.slideUp();
    }
  };

  return /** @alias module:CookieInfo */ {
    /** init */
    init: CookieInfo.init
  };

});
