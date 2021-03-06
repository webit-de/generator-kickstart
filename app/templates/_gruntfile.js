module.exports = function(grunt) {

  'use strict';

  if (grunt.option('q') || grunt.option('quiet')) {
    require('quiet-grunt');
  }

<% if (ProjectServer || DemoServer) { %>
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
  passphraseConfig();<% } %>

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
<% if (ProjectServer || DemoServer) { %>
    environments: {
      options: {
        local_path: './build',
      }<% if (ProjectServer) { %>,
      preview: {
        options: {
          username: grunt.file.readJSON('hostConfig.json').preview.username,
          host: grunt.file.readJSON('hostConfig.json').preview.hostServer,
          deploy_path: grunt.file.readJSON('hostConfig.json').preview.deployPath,
          current_symlink: 'web',
          releases_to_keep: 2,
          passphrase: passphraseConfig,
          privateKey: key
        }
      }<% } %><% if (DemoServer) { %>,
      demo: {
        options: {
          username: grunt.file.readJSON('hostConfig.json').demo.username,
          host: grunt.file.readJSON('hostConfig.json').demo.hostServer,
          deploy_path: grunt.file.readJSON('hostConfig.json').demo.deployPath,
          current_symlink: 'web',
          releases_to_keep: 2,
          passphrase: passphraseConfig,
          privateKey: key
        }
      }<% } %>
    },
<% } %>
    watch: {
      options: {
        spawn: false,
        livereload: true
      },

      // Styling
      scss: {
        files: 'components/**/*.scss',
        tasks: ['sync:webfonts', 'imagemin', 'postcss:development']
      },

      // Scripting
      js: {
        files: ['components/*.js', 'components/app/**/*.js', '!components/app/_deferred/**/*.js'],
        tasks: ['requirejs:development'],
      },
      js_deferred: {
        files: ['components/app/_deferred/**/*.js'],
        tasks: ['sync:deferred_js'],
      },
      json: {
        options: { livereload: true },
        files: ['components/app/**/*.json'],
        tasks: ['sync:json'],
      },

      // HTML
      html: {
        options: { livereload: true },
        files: ['*.html', 'components/app/**/*.html', '!build/**/*.html'],
        tasks: ['replace'],
      },

      // SVG
      svg: {
        options: { livereload: true },
        files: ['components/app/_svg/**/*.svg', 'components/app/_sprite-items/**/*.svg'],
        tasks: ['replace'],
      },

      // testdata
      testdata: {
        options: { livereload: true },
        files: ['testdata/*', 'components/app/**/testdata/*'],
        tasks: ['sync:testdata'],
      },

      // Images
      img_content: {
        options: { livereload: true },
        files: 'img/**/*.{png,gif,jpg,svg}',
        tasks: ['imagemin:content'],
      },
      img_background: {
        options: { livereload: true },
        files: [
          'components/**/*.{png,gif,svg,ico}',
          '!components/app/_svg/**/*.svg',
          '!components/app/_svg/*.svg',
          '!components/app/_sprite-items/**/*.svg'
        ],
        tasks: ['clean:css', 'imagemin:backgrounds'],
      },
      img_inline_svg: {
        options: { livereload: true },
        files: ['components/app/_svg/**/*.svg'],
        tasks: ['clean:css', 'imagemin:inline_svg' , 'postcss:development'],
      },

      // websocket support
      livereload: {
        options: { livereload: true, spawn: true },
        files: ['build/**/*.{css,js}']
      }
    },

    postcss: {
      options: {
        map: {
          inline: false,
          annotation: 'build/assets/css/'
        },
        parser: require('postcss-scss'),
        processors: [
          require('precss')({
            extension: 'scss'
          }),
          require('postcss-mixins'),
          require('postcss-simple-vars'),
          require('postcss-nested'),
          require('postcss-extend'),
          require('postcss-inline-image'),
          require('postcss-strip-inline-comments'),
          require("postcss-calc")({
            mediaQueries: true,
            selectors: true
          }),
          require('postcss-cssnext')({
            browsers: 'last 2 versions'
          }),
          require('rucksack-css'),
          require("css-mqpacker")({
            sort: true
          }),
        ],
        syntax: require('postcss-scss'),
        failOnError: true
      },

      development: {
        src: 'components/<%= ProjectName %>.scss',
        dest: 'build/assets/css/<%= ProjectName %>.css'
      },<% if (ProjectServer) { %>
      preview: {
        src: 'components/<%= ProjectName %>.scss',
        dest: 'build/assets/css/<%= ProjectName %>.css'
      },<% } %>
      live: {
        options: {
          map: false,
          parser: require('postcss-scss'),
          processors: [
            require('precss')({
              extension: 'scss'
            }),
            require('postcss-mixins'),
            require('postcss-simple-vars'),
            require('postcss-nested'),
            require('postcss-extend'),
            require('postcss-inline-image'),
            require('postcss-strip-inline-comments'),
            require("postcss-calc")({
              mediaQueries: true,
              selectors: true
            }),
            require('postcss-cssnext')({
              browsers: 'last 2 versions'
            }),
            require('rucksack-css'),
            require("css-mqpacker")({
              sort: true
            }),
            require('cssnano')({
              autoprefixer: false,
              safe: true
            })
          ]
        },
        src: 'components/<%= ProjectName %>.scss',
        dest: 'build/assets/css/<%= ProjectName %>.css'
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
      options: {
        output: {
          comments: 'some', // for license comments
        }
      },
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
          src: ['**/*.{gif,jpg,png,svg,ico}', '!_svg/**/*.svg', '!_svg/*.svg', '!**/font/*.svg'],
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
    <% if (includeSprite) { %>
    svgstore: {
      options: {
        cleanup: ['fill', 'style', 'class'],
        includeDescElement: false,
        includeTitleElement: false,
        formatting : {
          indent_size : 2
        }
      },
      default : {
        files: {
          'components/app/_svg/various/sprite.svg': ['components/app/_sprite-items/*.svg']
        }
      }
    },
    <% } %>
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
      },
      deferred_js: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'components/app/_deferred',
          src: ['**/*.js', '!**/test-*.js'],
          dest: 'build/assets/js/deferred'
        }]
      },
      testdata: {
        files: [{
          flatten: true,
          expand: true,
          cwd: '.',
          src: ['testdata/*', 'components/app/**/testdata/*'],
          dest: 'build/testdata'
        }],
          verbose: true
      },
      <% if (includeSprite) {%>
      svg_sprites: {
        files: [{
          flatten: false,
          expand: false,
          cwd: 'components/app/_svg/general/',
          src: ['*-sprite.svg'],
          dest: 'build/assets/img/inline-svg/general'
        }],
        verbose: true
      }
      <% } %>
    },

    jsdoc : {
      dist : {
        src: ['components/app/**/*.js'],
        options: {
          destination: 'documentation',
          private: true
        }
      }
    },

    scsslint: {
      options: {
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
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-sync');<% if (ProjectServer || DemoServer) {%>
    grunt.loadNpmTasks('grunt-ssh-deploy');<% } %><% if (includeSprite) {%>
    grunt.loadNpmTasks('grunt-svgstore');<% } %>

  grunt.registerTask('default', [
    'auto_install',
    'clean:build',<% if (includeSprite) { %>
    'svgstore',<% } %>
    'replace',
    'imagemin',
    'sync',
    'postcss:development',
    'requirejs:development',
    'uglify:external'
  ]);

  grunt.registerTask('live', [
    'clean:build',
    'replace:all_placeholder',
    'imagemin',
    'sync:webfonts',
    'sync:testdata',
    'sync:json',<% if (includeSprite) { %>
    'sync:svg_sprites',<% } %>
    'postcss:live',
    'requirejs:live',
    'uglify:deferred_live',
    'uglify:external'
  ]);
  <% if (ProjectServer) { %>
  grunt.registerTask('preview', [
    'auto_install',
    'clean:build',<% if (includeSprite) { %>
    'svgstore',<% } %>
    'replace',
    'imagemin',
    'sync',
    'postcss:preview',
    'requirejs:preview',
    'uglify:external',
    'ssh_deploy:preview'
  ]);<% } %>
  <% if (DemoServer) { %>
  grunt.registerTask('demo', [
    'clean:build',
    'replace:all_placeholder',
    'imagemin',
    'sync',
    'postcss:live',
    'requirejs:live',
    'uglify:deferred_live',
    'uglify:external',
    'ssh_deploy:demo'
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
