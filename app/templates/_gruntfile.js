module.exports = function(grunt) {

  'use strict';

  if (grunt.option('q') || grunt.option('quiet')) {
    require('quiet-grunt');
  }

<% if (ProjectServer) { %>
  var fileExists = require('file-exists'),
  fs = require('fs'),
  key = function() {
    if (fileExists('clientConfig.json')) {
      key = fs.readFileSync((require('userhome')(grunt.file.readJSON('clientConfig.json').keyPath)));
    } else {
      var idrsa = require('userhome')('.ssh/id_rsa');
      key = fileExists(idrsa) ? fs.readFileSync(idrsa) : '';
    }
  },

  passphraseConfig = function() {
    if (fileExists('clientConfig.json')) {
      passphraseConfig = grunt.file.readJSON('clientConfig.json').passphrase;
    } else {
      passphraseConfig = '';
    }
  };

  key();
  passphraseConfig();
<% } %>

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    auto_install: {
      local: {
        options: {
          failOnError: true,
          bower: false
        }
      }
    },
<% if (ProjectServer) { %>
    environments: {
      options: {
        local_path: './build',
      },
      preview: {
        options: {
          username: grunt.file.readJSON('hostConfig.json').username,
          host: grunt.file.readJSON('hostConfig.json').hostServer,
          deploy_path: grunt.file.readJSON('hostConfig.json').deployPath,
          current_symlink: 'web',
          releases_to_keep: 2,
          passphrase: passphraseConfig,
          privateKey: key
        }
      }
    },<% } %>

    watch: {
      options: {
        spawn: false
      },

      // Styling
      scss: {
        files: 'components/**/*.scss',
        tasks: ['sync:webfonts', 'imagemin', 'compass:development', 'modernizr']
      },

      // Scripting
      js: {
        files: ['components/*.js', 'components/app/**/*.js', '!components/app/_deferred/**/*.js'],
        tasks: ['requirejs:development', 'modernizr'],
      },
      js_deferred: {
        files: ['components/app/_deferred/**/*.js'],
        tasks: ['uglify:deferred_development', 'modernizr'],
      },
      js_bower: {
        files: ['components/bower/**/*.js'],
        tasks: ['uglify:external', 'requirejs:development'],
      },
      json: {
        options: { livereload: true },
        files: ['components/app/**/*.json'],
        tasks: ['sync:json'],
      },

      // HTML
      html: {
        options: { livereload: true },
        files: ['*.html','components/app/**/*.html' , '!components/bower/**/*.html', '!build/**/*.html'],
        tasks: ['replace'],
      },

      // SVG
      svg: {
        options: { livereload: true },
        files: ['components/app/_svg/**/*.svg'],
        tasks: ['replace'],
      },

      // Images
      img_content: {
        options: { livereload: true },
        files: 'img/**/*.{png,gif,jpg,svg}',
        tasks: ['imagemin:content'],
      },
      img_background: {
        options: { livereload: true },
        files: ['components/**/*.{png,gif,jpg,svg,ico}', '!_svg/**/*.svg', '!_svg/*.svg'],
        tasks: ['clean:css', 'imagemin:backgrounds' , 'compass:development'],
      },
      img_inline_svg: {
        options: { livereload: true },
        files: ['components/app/_svg/**/*.svg'],
        tasks: ['clean:css', 'imagemin:inline_svg' , 'compass:development'],
      },

      // websocket support
      livereload: {
        options: { livereload: true, spawn: true },
        files: ['build/**/*.{css,js}']
      }
    },

    compass: {
      options: {
        asset_cache_buster: false,
        bundleExec: true,
        cssDir: 'build/assets/css',
        httpFontsPath: '/assets/font',
        httpImagesPath: '/assets/img',
        imagesDir: 'build/assets/img',
        noLineComments: false,
        require: 'sass-css-importer',
        sassDir: 'components',
        specify: ['components/*.scss', 'components/app/_deferred/**/*.scss']
      },
      development: {
        options: {
          environment: 'development',
          sourcemap: true
        }
      },
      <% if (ProjectServer) { %>
      preview: {
        options: {
          environment: 'development',
          sourcemap: false,
        }
      },
      <% } %>
      live: {
        options: {
          environment: 'production',
          noLineComments: true,
          sourcemap: true,
          httpPath: '/' // . = relative
        }
      }
    },

    replace: {
      all_placeholder: {
        options: {
          excludeBuiltins: true,
          patterns: [
            {
              match: /{(app|deferred|svg):{([\w|\-]*)}}/g,
              replacement: function (match, type, file) {

                var
                is_svg = type === 'svg' ? true : false,
                extension = is_svg ? '.svg' : '.html',
                path = '',
                start = '',
                end = '';

                // use regular file

                // add app folder to deferred component
                type = type !== 'app' ? 'app/_' + type : type;

                // set path to file
                path = 'components/' + type + '/' + file + '/' + file + extension;

                if (is_svg) {
                  start = '<!-- START ' + path + ' -->\n';
                  end = '<!-- END ' + path + ' -->\n';
                }

                // get file for replacement
                // return start + grunt.file.read(path) + end;

                // Nesting
                var
                output = grunt.file.read(path),
                findMatch = output.match(/{(app|svg):{([\w|\-]{0,})}}|{(app|svg):{(.+):{(.+)}}}/g);

                if( findMatch !== null ) {

                  //replace each placeholder with its accociated file content
                  findMatch.forEach(function(elem){
                    var
                    inner_match = elem.replace( /[{}]/g,'').split(':'),
                    inner_type = inner_match[0] !== 'app' ? 'app/_' + inner_match[0] : inner_match[0],
                    inner_component = inner_match.length === 3 ? inner_match[1] : '',
                    inner_file = inner_match.length < 3 ? inner_match[1] : inner_match[2],
                    inner_regex = inner_match.length < 3 ? new RegExp("{" + inner_match[0] + ":{" + inner_file + "}}", "g") : new RegExp("{" + inner_match[0] + ":{" + inner_component + ":{" + inner_file + "}}}", "g"),
                    is_svg = inner_match[0] === 'svg' ? true : false,
                    extension = is_svg ? '.svg' : '.html',
                    path = inner_match.length < 3 ? 'components/' + inner_type + '/' + inner_file + '/' + inner_file + extension : 'components/' + inner_type + '/' + inner_component + '/' + inner_file + extension,
                    start = '',
                    end = '';

                    if (is_svg) {
                      start = '<!-- START ' + path + ' -->\n';
                      end = '<!-- END ' + path + ' -->\n';
                    }


                    var inner_output =  start + grunt.file.read(path) + end;

                    // write file content into main output
                    output = output.replace( inner_regex , inner_output );
                  });

                } else {
                  output = start + output + end;
                }

                return output;
              }
            },
            {
              match: /{(app|deferred|svg):{(.+):{(.+)}}}/g,
              replacement: function (match, type, component, alt_file) {

                var
                is_svg = type === 'svg' ? true : false,
                extension = is_svg ? '.svg' : '.html',
                path = '',
                start = '',
                end = '';

                // use alternate file

                // add app folder to deferred component
                type = type !== 'app' ? 'app/_' + type : type;

                // set path to file
                path = 'components/' + type + '/' + component + '/' + alt_file + extension;

                if (is_svg) {
                  start = '<!-- START ' + path + ' -->\n';
                  end = '<!-- END ' + path + ' -->\n';
                }

                // Nesting
                var
                output = grunt.file.read(path),
                findMatch = output.match(/{(app|svg):{([\w|\-]{0,})}}|{(app|svg):{(.+):{(.+)}}}/g);

                if( findMatch !== null ) {

                  //replace each placeholder with its accociated file content
                  findMatch.forEach(function(elem) {
                    var
                    inner_match = elem.replace( /[{}]/g,'').split(':'),
                    inner_type = inner_match[0] !== 'app' ? 'app/_' + inner_match[0] : inner_match[0],
                    inner_component = inner_match.length === 3 ? inner_match[1] : '',
                    inner_file = inner_match.length < 3 ? inner_match[1] : inner_match[2],
                    inner_regex = inner_match.length < 3 ? new RegExp("{" + inner_match[0] + ":{" + inner_file + "}}", "g") : new RegExp("{" + inner_match[0] + ":{" + inner_component + ":{" + inner_file + "}}}", "g"),
                    is_svg = inner_match[0] === 'svg' ? true : false,
                    extension = is_svg ? '.svg' : '.html',
                    path = inner_match.length < 3 ? 'components/' + inner_type + '/' + inner_file + '/' + inner_file + extension : 'components/' + inner_type + '/' + inner_component + '/' + inner_file + extension,
                    start = '',
                    end = '';

                    if (is_svg) {
                      start = '<!-- START ' + path + ' -->\n';
                      end = '<!-- END ' + path + ' -->\n';
                    }

                    var inner_output = start + grunt.file.read(path) + end;

                    // write file content into main output
                    output = output.replace( inner_regex , inner_output );
                  });

                } else {
                  output = start + output + end;
                }

                return output;
              }
            },
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['*.html'],
            dest: 'build/'
          }
        ]
      },
    <% if (livereload) { %>
      dev: {
        options: {
          excludeBuiltins: true,
          patterns: [
            {
              match: /<\/body>/g,
              replacement: function (match, type, file) {
                var
                body_markup = '</body>',
                livereload_markup = '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>';

                return livereload_markup +'\n\n' + body_markup + '\n';
              }
            },
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['build/*.html'],
            dest: 'build/'
          }
        ]
      }
    <% } %>
      },

    requirejs: {
      options: {
        mainConfigFile: 'components/<%= ProjectName %>.js',
        name: '<%= ProjectName %>',
        out: 'build/assets/js/<%= ProjectName %>.js',
        useStrict: true
      },
      development: {
        options: {
          generateSourceMaps: true,
          optimize: 'none'
        }
      },
      <% if (ProjectServer) { %>
      preview: {
        options: {
          generateSourceMaps: false,
          optimize: 'none'
        }
      },
      <% } %>
      live: {
        options: {
          generateSourceMaps: false,
          optimize: 'uglify'
        }
      }
    },

    uglify: {
      deferred_development: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: 'components/app/_deferred',
          src: ['**/*.js', '!**/test-*.js'],
          dest: 'build/assets/js/deferred'
        }]
      },
      <% if (ProjectServer) { %>
      deferred_preview: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'components/app/_deferred',
          src: ['**/*.js', '!**/test-*.js'],
          dest: 'build/assets/js/deferred'
        }]
      },
      <% } %>
      deferred_live: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'components/app/_deferred',
          src: ['**/*.js', '!**/test-*.js'],
          dest: 'build/assets/js/deferred'
        }]
      },
      external: {
        files: {
          'build/assets/js/libs/require.js': ['components/libs/requirejs/require.js']
        }
      }
    },

    imagemin: {
      content: {
        files: [{
          flatten: true,
          expand: true,
          cwd: 'img',
          src: ['**/*.{gif,ico,jpg,png,svg}'],
          dest: 'build/img'
        }]
      },
      backgrounds: {
        files: [{
          flatten: true,
          expand: true,
          cwd: 'components/app',
          src: ['**/*.{gif,jpg,png,svg,ico}', '!_svg/**/*.svg', '!_svg/*.svg'],
          dest: 'build/assets/img'
        }]
      },
      inline_svg: {
        files: [{
          flatten: false,
          expand: true,
          cwd: 'components/app/_svg',
          src: ['**/*.svg','*.svg'],
          dest: 'build/assets/img/inline-svg'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['components/app/**/*.js']
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc',
        import: false
      },
      lax: {
        src: ['build/assets/css/**/*.css']
      }
    },

    accessibility: {
      options : {
        accessibilityLevel: 'WCAG2<%= WCAG2 %>',
        accessibilityrc: true,
        domElement: true,
        reportLevels: {
          notice: false,
          warning: true,
          error: true
        }
      },
      development : {
        files: [{
          expand  : true,
          cwd     : 'build/',
          src     : ['*.html']
        }]
      }
    },

    clean: {
      css: {
        src: ['build/assets/css/**/*.css']
      },
      build: {
        src: ['build']
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:10000/qunit/qunit-test-suite.html'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 10000,
          base: '.'
        }
      }
    },

    sync: {
      webfonts: {
        files: [{
          flatten: true,
          expand: true,
          cwd: 'components/app',
          src: ['**/font/**/*.{ttf,eot,woff,woff2,svg}'],
          dest: 'build/assets/font'
        }],
        verbose: true
      },
      json: {
        files: [{
          flatten: true,
          expand: true,
          cwd: 'components/app',
          src: ['**/*.json'],
          dest: 'build/assets/json'
        }],
        verbose: true
      }
    },

    modernizr: {
      dist: {
        'devFile' : 'components/libs/modernizr/modernizr.js',
        'dest' : 'build/assets/js/libs/modernizr.js',
        'options' : [
          'setClasses'
        ],
        'uglify' : true,
        'files' : {
          'src': ['components/app/**/*.js', 'build/**/*.css']
        }
      }
    },

    jsdoc : {
      dist : {
        src: ['components/app/**/*.js'],
        options: {
          destination: 'documentation'
        }
      }
    },

    scsslint: {
      options: {
        bundleExec: true,
        colorizeOutput: true,
        compact: true,
        config: '.scsslintrc',
        reporterOutput: null
      },
      scss: [
        'components/app/**/*.scss',
      ]
    }

  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-accessibility');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-sync');
  <% if (ProjectServer) { %>grunt.loadNpmTasks('grunt-ssh-deploy');<% } %>

  grunt.registerTask('default', [
    'auto_install',
    'clean:build',
    'replace',
    'imagemin',
    'sync',
    'compass:development',
    'requirejs:development',
    'uglify:deferred_development',
    'uglify:external',
    'modernizr'
  ]);

  grunt.registerTask('live', [
    'clean:build',
    'replace:all_placeholder',
    'imagemin',
    'sync',
    'compass:live',
    'requirejs:live',
    'uglify:deferred_live',
    'uglify:external',
    'modernizr'
  ]);
  <% if (ProjectServer) { %>
  grunt.registerTask('preview', [
    'auto_install',
    'clean:build',
    'replace',
    'imagemin',
    'sync',
    'compass:preview',
    'requirejs:preview',
    'uglify:deferred_preview',
    'uglify:external',
    'modernizr',
    'ssh_deploy:preview'
  ]);<% } %>

  grunt.registerTask('test', [
    'csslint',
    'scsslint',
    'jshint',
    'accessibility',
    'connect',
    'qunit:all'
  ]);

  grunt.registerTask('doc', [
    'jsdoc'
  ]);

};
