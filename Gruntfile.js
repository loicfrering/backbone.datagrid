/* jshint scripturl: true */
module.exports = function(grunt) {

  var marked = require('marked');
  var hljs   = require('highlight.js');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '// <%= pkg.name %> v<%= pkg.version %>\n' +
              '//\n' +
              '// Copyright (c) 2012 <%= pkg.author %>\n' +
              '// Distributed under the <%= pkg.license %> license\n'
    },
    jshint: {
      grunt: 'Gruntfile.js',
      src:   'src/**/!(intro|outro).js',
      dist:  'dist/<%= pkg.name %>.js'
    },
    mocha: {
      src: {
        src: 'test/index.html',
        options: {run: true}
      },
      dist: {
        src: 'test/dist.html',
        options: {run: true}
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          'src/intro.js',
          'src/views/composed.js',
          'src/views/datagrid.js',
          'src/views/table.js', 'src/views/header.js', 'src/views/row.js', 'src/views/controls.js',
          'src/views/controls/control.js', 'src/views/controls/pagination.js', 'src/views/controls/items-per-page.js',
          'src/views/cells/cell.js', 'src/views/cells/callback-cell.js', 'src/views/cells/action-cell.js', 'src/views/cells/header-cell.js', 'src/views/cells/template-cell.js',
          'src/models/pager.js', 'src/models/sorter.js',
          'src/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<banner>', 'dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');

  // Custom site task.
  grunt.registerTask('site', 'Generate index.html from README.md.', function() {
    var readme   = grunt.file.read('README.md');
    var template = grunt.file.read('template.html');
    var html     = marked(readme, {
      gfm: true,
      highlight: function(code, lang) {
        if (lang) {
          return hljs.highlight(lang, code).value;
        }
        return code;
      }
    });

    html = grunt.template.process(template, {data: {content: html}});
    grunt.file.write('index.html', html);
    grunt.log.writeln('File "index.html" created.');
  });

  // Default task and aliases.
  grunt.registerTask('test', ['jshint:grunt', 'jshint:src', 'mocha:src']);
  grunt.registerTask('dist', ['concat', 'jshint:dist', 'uglify', 'mocha:dist']);
  grunt.registerTask('default', ['test', 'dist', 'site']);
};
