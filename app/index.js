/**
 * Generates a new project.
 * @module KickstartGenerator
 * @requires chalk
 * @requires mkdirp
 * @requires underscore.string
 * @requires yeoman-generator
 * @requires yosay
 * @author mail@markus-falk.com schramm@webit.de
 */

'use strict';

var

chalk = require('chalk'),
mkdirp = require('mkdirp'),
string = require('underscore.string'),
yeoman = require('yeoman-generator'),
yosay = require('yosay'),

KickstartGenerator = yeoman.Base.extend({

  /**
   * Loads package.json and waits for callback to finish.
   * @function init
   * @private
   */
  init: function () {

    this.pkg = require('../package.json');

    this.on('end', function () {

      if(this.wysiwygCMS) {
        this.log('Don\'t forget to run: ' + chalk.yellow('yo kickstart-webit:addcomponent backend'));
        this.log('\n');
      }
    });

  },

  /**
   * Converts user's answers into Booleans.
   * @function _hasFeature
   * @returns {Boolean} Is this feature wanted?
   * @private
   */
  _hasFeature: function (feature) {
    return this.features && this.features.indexOf(feature) !== -1;
  },

  /**
   * Ask user on project details.
   * @function askFor
   * @private
   */
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Sit back and relax while I setup your project.'));

    var prompts = [
      {
        type: 'input',
        name: 'ProjectName',
        message: 'What is the project\'s name?'
      },
      {
        type: 'input',
        name: 'ProjectManager',
        message: 'Who is the project manager?'
      },
      {
        type: 'input',
        name: 'GraphicDesigner',
        message: 'Who is the graphic designer?'
      },
      {
        type: 'input',
        name: 'HTMLDeveloper',
        message: 'Who is developing the front end?'
      },
      {
        type: 'checkbox',
        name: 'whatFunctions',
        message: 'What Functions do you need?',
        choices: [
          {
            name: 'RWD',
            value: 'includeRwd',
            checked: true
          },
          {
            name: 'SVG-Sprite',
            value: 'includeSprite',
            checked: true
          },
          {
            name: 'CookieInfo',
            value: 'includeCookie',
            checked: true
          },
          {
            name: 'FigureElement',
            value: 'includeFigureElement',
            checked: true
          },
          {
            name: 'SocialSharing',
            value: 'includeSocialSharing',
            checked: true
          },
          {
            name: 'DefaultForm',
            value: 'includeDefaultForm',
            checked: true
          },
          {
            name: 'ScForm',
            value: 'includeScForm',
            checked: true
          },
          {
            name: 'SearchResults',
            value: 'includeSearchResults',
            checked: true
          },
          {
            name: 'Template Errorpage',
            value: 'includeErrorpage',
            checked: true
          }
        ]
      },
      {
        type: 'confirm',
        name: 'ProjectServer',
        message: 'Do you want to deploy to a webserver?',
        default: true,
      },
      {
        when: function(response) {
          return response.ProjectServer;
        },
        type: 'input',
        name: 'UsernamePreview',
        message: 'What is the Username?'
      },
      {
        when: function(response) {
          return response.ProjectServer;
        },
        type: 'input',
        name: 'sshPath',
        message: 'Please insert the Path to your ssh-Key, starting from Home.',
        default: '.ssh/id_rsa'
      },
      {
        when: function(response) {
          return response.ProjectServer;
        },
        type: 'input',
        name: 'HostServerPreview',
        message: 'What is the Hostserver?'
      },
      {
        when: function(response) {
          return response.ProjectServer;
        },
        type: 'input',
        name: 'DeployPathPreview',
        message: 'What is the Deploymentpath?'
      },
      {
        type: 'confirm',
        name: 'DemoServer',
        message: 'Do you want to deploy to a demoserver?',
        default: true,
      },
      {
        when: function(response) {
          return response.DemoServer;
        },
        type: 'input',
        name: 'UsernameDemo',
        message: 'What is the Username?'
      },
      {
        when: function(response) {
          return response.DemoServer;
        },
        type: 'input',
        name: 'sshPath',
        message: 'Please insert the Path to your ssh-Key, starting from Home.',
        default: '.ssh/id_rsa'
      },
      {
        when: function(response) {
          return response.DemoServer;
        },
        type: 'input',
        name: 'HostServerDemo',
        message: 'What is the Hostserver?'
      },
      {
        when: function(response) {
          return response.DemoServer;
        },
        type: 'input',
        name: 'DeployPathDemo',
        message: 'What is the Deploymentpath?'
      },
      {
        type: 'confirm',
        name: 'wysiwygCMS',
        message: 'Do you need additional setup for your wysiwyg CMS?',
        default: false
      },
      {
        type: 'confirm',
        name: 'livereload',
        message: 'Would you like include livereload.js into your sandbox.html?',
        default: true
      },
      {
        type: 'list',
        name: 'WCAG2',
        message: 'What WCAG2A level would you like to develop for?',
        choices: [{
          name: 'A',
          value: 'A'
        },
        {
          name: 'AA',
          value: 'AA'
        },
        {
          name: 'AAA',
          value: 'AAA'
        }]
      }
    ];

    this.prompt(prompts, function (answers) {

      // README
      this.GraphicDesigner = answers.GraphicDesigner;
      this.HTMLDeveloper = answers.HTMLDeveloper;
      this.ProjectManager = answers.ProjectManager;

      // whatFunctions
      this.features = answers.whatFunctions;
      this.includeRwd = this._hasFeature('includeRwd');
      this.includeCookie = this._hasFeature('includeCookie');
      this.includeFigureElement = this._hasFeature('includeFigureElement');
      this.includeSocialSharing = this._hasFeature('includeSocialSharing');
      this.includeDefaultForm = this._hasFeature('includeDefaultForm');
      this.includeScForm = this._hasFeature('includeScForm');
      this.includeSearchResults = this._hasFeature('includeSearchResults');
      this.includeErrorpage = this._hasFeature('includeErrorpage');
      this.includeSprite = this._hasFeature('includeSprite');

      // ProjectServer
      this.ProjectName = string.slugify(answers.ProjectName);
      this.ProjectServer = answers.ProjectServer;
      this.HostServerPreview = answers.HostServerPreview;
      this.UsernamePreview = answers.UsernamePreview;
      this.sshPath = answers.sshPath;
      this.DeployPathPreview = answers.DeployPathPreview;

      // DemoServer
      this.DemoServer = answers.DemoServer;
      this.HostServerDemo = answers.HostServerDemo;
      this.UsernameDemo = answers.UsernameDemo;
      this.DeployPathDemo = answers.DeployPathDemo;

      // wysiwygCMS
      this.wysiwygCMS = answers.wysiwygCMS;

      // livereload
      this.livereload = answers.livereload;

      // Support level
      this.WCAG2 = answers.WCAG2;

      done();
    }.bind(this));
  },

  /**
   * Create empty folders needed for project.
   * @function folders
   * @private
   */
  folders: function () {
    mkdirp.mkdirp('img');
    mkdirp.mkdirp('testdata');
  },

  /**
   * Create all package files from templates.
   * @function packagefiles
   * @private
   */
  packagefiles: function () {

    this.fs.copyTpl(
      this.templatePath('_accessibilityrc'),
      this.destinationPath('.accessibilityrc')
    );

    this.fs.copyTpl(
      this.templatePath('_bowerrc'),
      this.destinationPath('.bowerrc')
    );

    this.fs.copyTpl(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore'),
      {
        ProjectServer: this.ProjectServer
      }
    );

    this.fs.copyTpl(
      this.templatePath('_editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('_csslintrc'),
      this.destinationPath('.csslintrc')
    );

    this.fs.copyTpl(
      this.templatePath('_scss-lint.yml'),
      this.destinationPath('.scss-lint.yml')
    );

    this.fs.copyTpl(
      this.templatePath('_jshintrc'),
      this.destinationPath('.jshintrc')
    );

    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      {
        ProjectName: this.ProjectName
      }
    );

    this.fs.copyTpl(
      this.templatePath('_gruntfile.js'),
      this.destinationPath('gruntfile.js'),
      {
        ProjectName: this.ProjectName,
        ProjectServer: this.ProjectServer,
        DemoServer: this.DemoServer,
        WCAG2: this.WCAG2,
        livereload: this.livereload,
        includeSprite: this.includeSprite
      }
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        ProjectName: this.ProjectName,
        ProjectServer: this.ProjectServer,
        DemoServer: this.DemoServer,
        includeSprite: this.includeSprite
      }
    );

    if (this.ProjectServer || this.DemoServer) {
      this.fs.copyTpl(
        this.templatePath('_clientConfig.json'),
        this.destinationPath('clientConfig.json'),
        {
          sshPath: this.sshPath
        }
      );

      this.fs.copyTpl(
        this.templatePath('_hostConfig.json'),
        this.destinationPath('hostConfig.json'),
        {
          ProjectName: this.ProjectName,
          ProjectServer: this.ProjectServer,
          DemoServer: this.DemoServer,
          UsernamePreview: this.UsernamePreview,
          UsernameDemo: this.UsernameDemo,
          HostServerPreview: this.HostServerPreview,
          HostServerDemo: this.HostServerDemo,
          DeployPathPreview: this.DeployPathPreview,
          DeployPathDemo: this.DeployPathDemo
        }
      );
    }

    this.fs.copyTpl(
      this.templatePath('_readme.md'),
      this.destinationPath('README.md'),
      {
        ProjectName: this.ProjectName,
        WCAG2: this.WCAG2,
        GraphicDesigner: this.GraphicDesigner,
        HTMLDeveloper: this.HTMLDeveloper,
        ProjectManager: this.ProjectManager
      }
    );

  },

  /**
   * Create all javascript files from templates.
   * @function javascript
   * @private
   */
  javascript: function () {

    this.fs.copyTpl(
      this.templatePath('_frontend-template-setup.js'),
      this.destinationPath('components/' + this.ProjectName + '.js'),
      {
        includeCookie: this.includeCookie,
        includeSocialSharing: this.includeSocialSharing
      }
    );

    this.fs.copyTpl(
      this.templatePath('_main.js'),
      this.destinationPath('components/app/main.js'),
      {
        HTMLDeveloper: this.HTMLDeveloper,
        includeCookie: this.includeCookie,
        includeSocialSharing: this.includeSocialSharing
      }
    );
  },

  /**
   * Create all files needed for QUnit from templates.
   * @function qunit
   * @private
   */
  qunit: function () {

    this.fs.copyTpl(
      this.templatePath('qunit/_qunit-test-suite.html'),
      this.destinationPath('qunit/qunit-test-suite.html'),
      {
        ProjectName: this.ProjectName
      }
    );

    this.fs.copy(
      this.templatePath('qunit/_unit.js'),
      this.destinationPath('qunit/unit.js')
    );

    this.fs.copy(
      this.templatePath('qunit/_config.js'),
      this.destinationPath('qunit/config.js')
    );

  },

  /**
   * Create all scss files from templates.
   * @function styles
   * @private
   */
  styles: function () {
    this.fs.copyTpl(
      this.templatePath('_frontend-template-setup.scss'),
      this.destinationPath('components/' + this.ProjectName + '.scss'),
      {
        includeCookie: this.includeCookie,
        includeFigureElement: this.includeFigureElement,
        includeDefaultForm: this.includeDefaultForm,
        includeScForm: this.includeScForm,
        includeSearchResults: this.includeSearchResults,
        includeSocialSharing: this.includeSocialSharing,
        includeSprite: this.includeSprite
      }
    );

    if (this.includeErrorpage) {
      this.fs.copyTpl(
        this.templatePath('_frontend-template-setup-errorpage.scss'),
        this.destinationPath('components/' + this.ProjectName + '-errorpage.scss')
      );

      this.fs.copy(
        this.templatePath('_svg/errorpages/_error-400.svg'),
        this.destinationPath('components/app/_svg/errorpages/error-400.svg')
      );

      this.fs.copy(
        this.templatePath('_svg/errorpages/_error-404.svg'),
        this.destinationPath('components/app/_svg/errorpages/error-404.svg')
      );

      this.fs.copy(
        this.templatePath('_svg/errorpages/_error-500.svg'),
        this.destinationPath('components/app/_svg/errorpages/error-500.svg')
      );
    }
  },

  /**
   * Create all HTML files from templates.
   * @function html
   * @private
   */
  html: function () {
    this.fs.copyTpl(
      this.templatePath('_sandbox.html'),
      this.destinationPath('sandbox.html'),
      {
        ProjectName: this.ProjectName,
        wysiwygCMS: this.wysiwygCMS,
        includeSprite: this.includeSprite
      }
    );

    if (this.includeErrorpage) {
      this.fs.copyTpl(
        this.templatePath('_errorpage.html'),
        this.destinationPath('errorpage.html'),
        {
          ProjectName: this.ProjectName
        }
      );
    }
  },

  /**
   * Create all Components from templates.
   * @function defaultComponents
   * @private
   */
  defaultComponents: function () {

    // site-icons
    this.fs.copyTpl(
      this.templatePath('site-icons/_site-icons.html'),
      this.destinationPath('components/app/site-icons/site-icons.html')
    );

    this.fs.copyTpl(
      this.templatePath('site-icons/_windows-tile-icon.html'),
      this.destinationPath('components/app/site-icons/windows-tile-icon.html')
    );

    this.fs.copy(
      this.templatePath('site-icons/img/_favicon.ico'),
      this.destinationPath('components/app/site-icons/img/favicon.ico')
    );

    this.fs.copy(
      this.templatePath('site-icons/img/_apple-touch-icon.png'),
      this.destinationPath('components/app/site-icons/img/apple-touch-icon.png')
    );

    this.fs.copy(
      this.templatePath('site-icons/img/_windows-tile-icon.png'),
      this.destinationPath('components/app/site-icons/img/windows-tile-icon.png')
    );

    // _core
    this.fs.copyTpl(
      this.templatePath('_core/_core.js'),
      this.destinationPath('components/app/_core/_core.js'),
      {
        includeRwd: this.includeRwd
      }
    );

    // default styles
    this.fs.copyTpl(
      this.templatePath('base/_base.scss'),
      this.destinationPath('components/app/base/_base.scss'),
      {
        includeRwd: this.includeRwd
      }
    );

    this.fs.copyTpl(
      this.templatePath('common/_common.scss'),
      this.destinationPath('components/app/common/_common.scss'),
      {
        includeRwd: this.includeRwd
      }
    );

    // Sandbox-Sitemap
    this.fs.copyTpl(
      this.templatePath('sandbox-sitemap/_sandbox-sitemap.css.html'),
      this.destinationPath('components/app/sandbox-sitemap/sandbox-sitemap.css.html'),
      {
        ProjectName: this.ProjectName,
        includeErrorpage: this.includeErrorpage
      }
    );
    // Sandbox-Sitemap
    this.fs.copyTpl(
      this.templatePath('sandbox-sitemap/_sandbox-sitemap.js.html'),
      this.destinationPath('components/app/sandbox-sitemap/sandbox-sitemap.js.html'),
      {
        ProjectName: this.ProjectName,
        includeErrorpage: this.includeErrorpage
      }
    );
    // Sandbox-Sitemap
    this.fs.copyTpl(
      this.templatePath('sandbox-sitemap/_sandbox-sitemap.html'),
      this.destinationPath('components/app/sandbox-sitemap/sandbox-sitemap.html'),
      {
        ProjectName: this.ProjectName,
        includeErrorpage: this.includeErrorpage
      }
    );
  },

  /**
   * Create all files for cookie-info from templates.
   * @function cookieInfo
   * @private
   */
  cookieInfo: function () {
    if (this.includeCookie) {
      this.fs.copyTpl(
        this.templatePath('cookie-info/_cookie-info.html'),
        this.destinationPath('components/app/cookie-info/cookie-info.html')
      );

      this.fs.copyTpl(
        this.templatePath('cookie-info/_cookie-info.scss'),
        this.destinationPath('components/app/cookie-info/_cookie-info.scss')
      );

      this.fs.copyTpl(
        this.templatePath('cookie-info/_cookie-info.js'),
        this.destinationPath('components/app/cookie-info/cookie-info.js')
      );

      this.fs.copyTpl(
        this.templatePath('cookie-info/_cookie.js'),
        this.destinationPath('components/libs/cookie/cookie.js')
      );

      this.fs.copy(
        this.templatePath('cookie-info/_LICENSE'),
        this.destinationPath('components/libs/cookie/LICENSE')
      );
    }
  },

  /**
   * Create all files for iconSprite from templates.
   * @function SVG-Sprite
   * @private
   */
  iconSprite: function () {
    if (this.includeSprite) {
      this.fs.copyTpl(
        this.templatePath('sprite-items/kickstart.svg'),
        this.destinationPath('components/app/_sprite-items/kickstart.svg')
      );

      this.fs.copyTpl(
        this.templatePath('_svg/various/sprite.svg'),
        this.destinationPath('components/app/_svg/various/sprite.svg')
      );
    }
  },

  /**
   * Create all files for figure-Element from templates.
   * @function FigureElement
   * @private
   */
  FigureElement: function () {
    if (this.includeFigureElement) {
      this.fs.copyTpl(
        this.templatePath('figure/_figure.html'),
        this.destinationPath('components/app/figure/figure.html')
      );

      this.fs.copyTpl(
        this.templatePath('figure/_figure.scss'),
        this.destinationPath('components/app/figure/_figure.scss')
      );
    }
  },

  /**
   * Create all files for social-media-share from templates.
   * @function SocialSharing
   * @private
   */
  SocialSharing: function () {
    if (this.includeSocialSharing) {
      this.fs.copyTpl(
        this.templatePath('social-media-share/_social-media-share-metatags.html'),
        this.destinationPath('components/app/social-media-share/social-media-share-metatags.html')
      );

      this.fs.copyTpl(
        this.templatePath('social-media-share/_social-media-share.html'),
        this.destinationPath('components/app/social-media-share/social-media-share.html')
      );

      this.fs.copyTpl(
        this.templatePath('social-media-share/_social-media-share.js'),
        this.destinationPath('components/app/social-media-share/social-media-share.js')
      );
    }
  },

  /**
   * Create all files for default form from templates.
   * @function DefaultForm
   * @private
   */
  DefaultForm: function () {
    if (this.includeDefaultForm) {
      this.fs.copyTpl(
        this.templatePath('form/_form.html'),
        this.destinationPath('components/app/form/form.html')
      );

      this.fs.copyTpl(
        this.templatePath('form/_form.scss'),
        this.destinationPath('components/app/form/_form.scss')
      );
    }
  },

  /**
   * Create all files for sc-forms from templates.
   * @function ScForm
   * @private
   */
  ScForm: function () {
    if (this.includeScForm) {
      this.fs.copyTpl(
        this.templatePath('form/_sc-form.html'),
        this.destinationPath('components/app/form/sc-form.html')
      );

      this.fs.copyTpl(
        this.templatePath('form/_sc-form.scss'),
        this.destinationPath('components/app/form/_sc-form.scss')
      );
    }
  },

  /**
   * Create all files for search-results from templates.
   * @function SearchResults
   * @private
   */
  SearchResults: function () {
    if (this.includeSearchResults) {
      this.fs.copyTpl(
        this.templatePath('search-results/_search-results.html'),
        this.destinationPath('components/app/search-results/search-results.html')
      );

      this.fs.copyTpl(
        this.templatePath('search-results/_search-results.scss'),
        this.destinationPath('components/app/search-results/_search-results.scss')
      );
    }
  },

  /**
   * Automatically install all dependencies.
   * @function install
   * @private
   */
  install: function () {

    if (!this.options['skip-install']) {
      // bower & npm
      this.installDependencies();
    }
  }

});

module.exports = KickstartGenerator;
