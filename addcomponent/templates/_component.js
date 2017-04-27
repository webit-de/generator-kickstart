/**
 * TODO: add description
 * @module <%= class_name %>
 * @requires jquery
 * @requires _core
 * @requires jquery.exists
 * @author TODO: add author
 */
define([
  'jquery',
  '_core',
  'jquery.exists'
], function(
  $,
  _Core,
  exists
) {

  'use strict';

  var <%= class_name %> = {

    /**
     * Caches all jQuery Objects, Strings or Variables for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$<%= _name %> = _Core.$body.find('.<%= slug_name %>');
      // this.string = 'string';
      // this.integer = 0;
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      <%= class_name %>._cacheElements();

      <%= class_name %>.$<%= _name %>.exists(function() {
        <%= class_name %>._bindEvents();
      });
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {
    }

  };

  return /** @alias module:<%= class_name %> */ {
    /** init */
    init: <%= class_name %>.init
  };

});
