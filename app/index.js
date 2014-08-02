'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var KickstartGenerator = yeoman.generators.Base.extend({

  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  _hasFeature: function (feature) {
    return this.features && this.features.indexOf(feature) !== -1;
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Kickstart Generator @ webit! Scholar Day'));

    var prompts = [
      {
        type: 'input',
        name: 'ProjectName',
        message: 'Your project name.'
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
        message: 'Whats your name?'
      },
      {
        type: 'confirm',
        name: 'oldIE',
        message: 'Support IE8?',
        default: false
      },
      {
        type: 'checkbox',
        name: 'ContentElements',
        message: 'What more would you like?',
        choices: [{
          name: 'Accordion',
          value: 'includeAccordion',
          checked: false
        },
        {
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        }]
      },
      {
        type: 'list',
        name: 'WCAG2',
        message: 'What WCAG2A level would you like to develop for?',
        choices: [{
          name: 'A',
          value: 'WCAG2A'
        },
        {
          name: 'AA',
          value: 'WCAG2AA'
        },
        {
          name: 'AAA',
          value: 'WCAG2AAA'
        }]
      }
    ];

    this.prompt(prompts, function (answers) {

      this.ProjectName = answers.ProjectName;
      this.oldIE = answers.oldIE;
      this.ProjectManager = answers.ProjectManager;
      this.HTMLDeveloper = answers.HTMLDeveloper;
      this.GraphicDesigner = answers.GraphicDesigner;

      this.features = answers.ContentElements;

      this.includeAccordion = this._hasFeature('includeAccordion');
      this.includeModernizr = this._hasFeature('includeModernizr');

      this.WCAG2 = answers.WCAG2;

      // this.log(chalk.bgYellow(chalk.black('###############################')));
      // this.log('answers.ContentElements: ', answers.ContentElements);
      // this.log('this.features: ', this.features);
      // this.log('includeModernizr: ', this.includeModernizr);
      // this.log('includeAccordion: ', this.includeAccordion);
      // this.log(chalk.bgYellow(chalk.black('###############################')));

      done();
    }.bind(this));
  },

  folders: function () {
    this.mkdir('components/app/_deferred');
    this.mkdir('components/bower');
    this.mkdir('img');
  },

  packagefiles: function () {
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_gitignore', '.gitignore');
    this.copy('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_csslintrc', '.csslintrc');
    this.template('_gruntfile.js', 'gruntfile.js');
    this.template('_readme.md', 'README.md');
  },

  javascript: function () {
    this.template('_frontend-template-setup.js', 'components/' + this._.slugify(this.ProjectName) + '.js');
    this.template('_main.js', 'components/app/main.js');
  },

  styles: function () {
    this.copy('_frontend-template-setup.scss', 'components/' + this._.slugify(this.ProjectName) + '.scss');
  },

  html: function () {
    this.template('_sandbox.html', 'sandbox.html');
  }

});

module.exports = KickstartGenerator;
