/**
 * Generates Links for different platforms from og meta tags or respective information
 * @module SocialMediaShare
 * @requires jquery
 * @requires jquery.exists
 * @author ruediger@webit.de
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

  var SocialMediaShare = {
    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$social_media_share = _Core.$html.find('.social-media-share');
      this.$social_media_share_links = this.$social_media_share.find('a');
      this.$social_media_share_facebook = this.$social_media_share.find('.social-media-facebook');
      this.$social_media_share_twitter = this.$social_media_share.find('.social-media-twitter');
      this.$social_media_share_googleplus = this.$social_media_share.find('.social-media-googleplus');
      this.$social_media_share_xing = this.$social_media_share.find('.social-media-xing');
      this.$social_media_share_whatsapp = this.$social_media_share.find('.social-media-whatsapp');
      this.$social_media_share_pinterest = this.$social_media_share.find('.social-media-pinterest');
      this.$social_media_share_email = this.$social_media_share.find('.social-media-email');

      this.currentUrl = _Core.window.location.href;
      this.currentTitle = _Core.document.find('title').text();
      this.currentImage = $('meta[property="og:image"]').attr('content');
      this.hashtag = 'hashtag';
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      SocialMediaShare._cacheElements();

      SocialMediaShare.$social_media_share.exists(function() {
        SocialMediaShare._setLinks();
        SocialMediaShare._bindEvents();
      });
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {
      SocialMediaShare.$social_media_share_links.not(SocialMediaShare.$social_media_share_email).on('click', function(event) {
        var $this = $(this);
        event.preventDefault();
        _Core.window.open($this.attr('href'), $this.text(), 'width=650, height=450, resizable=yes, scrollbars=yes');
      });
    },

    /**
     * Generates platform specific links from og tags
     * @function _setLinks
     * @private
     */
    _setLinks: function() {
      var currentUrl = '',
          currentTitle = '',
          currentImage = '',
          emailSubject = '',
          emailBody = '';

      this.$social_media_share.each(function() {
        // Check if there is an Url to share, if not get the Page Url, it's Title and the Image
        if ($(this).attr('data-url') === undefined) {
          currentUrl = SocialMediaShare.currentUrl;
          currentTitle = ($('meta[property="og:title"]').length ? $('meta[property="og:title"]').attr('content') : SocialMediaShare.currentTitle);
          currentImage = SocialMediaShare.currentImage;
        } else {
          // Get declared Url and Tittle
          currentUrl = $(this).attr('data-url');
          currentTitle = $(this).attr('data-title');
          currentImage = $(this).attr('data-image');
        }

        // emailBody - languages
        switch (SocialMediaShare.currentLanguage) {
          case 'fr':
            emailSubject = currentTitle + ' - article intéressant trouvé sur le site Dr. Beckmann';
            emailBody = 'Bonjour,\n\nJ‘ai trouvé un article intéressant sur le site Dr. Beckmann.\n\n' + currentTitle + '\n' + currentUrl + '\n\nCordialement';
            break;
          default:
            emailSubject = currentTitle + ' - Weiterempfohlen von der Seite von Dr. Beckmann';
            emailBody = 'Hallo,\n\nich habe gerade diesen interessanten Artikel auf der Seite von Dr. Beckmann gelesen.\n\n' + currentTitle + '\n' + currentUrl + '\n\nMit freundlichen Grüßen.';
            break;
        }

        // creates the share link
        var facebook_link = 'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl,
            twitter_link = 'https://twitter.com/intent/tweet?url=' + currentUrl + '&text=' + encodeURI(currentTitle),
            googleplus_link = 'https://plus.google.com/share?url=' + currentUrl,
            xing_link = 'https://www.xing.com/spi/shares/new?url=' + currentUrl,
            whatsapp_link = 'whatsapp://send?text=' + encodeURI(currentTitle) + ' - ' + currentUrl,
            pinterest_link = 'https://www.pinterest.com/pin/create/button/?url=' + currentUrl + '&media=' + currentImage + '&description=' + encodeURI(currentTitle),
            email_link = 'mailto:?subject=' + encodeURI(emailSubject) + '&body=' + encodeURI(emailBody);

        // write the href attribute
        $(this).find(SocialMediaShare.$social_media_share_facebook).attr('href', facebook_link);
        $(this).find(SocialMediaShare.$social_media_share_twitter).attr('href', twitter_link);
        $(this).find(SocialMediaShare.$social_media_share_googleplus).attr('href', googleplus_link);
        $(this).find(SocialMediaShare.$social_media_share_xing).attr('href', xing_link);
        $(this).find(SocialMediaShare.$social_media_share_whatsapp).attr('href', whatsapp_link);
        $(this).find(SocialMediaShare.$social_media_share_pinterest).attr('href', pinterest_link);
        $(this).find(SocialMediaShare.$social_media_share_email).attr('href', email_link);
      });
    }
  };

  return /** @alias module:SocialMediaShare */ {
    /** init */
    init: SocialMediaShare.init
  };
});
