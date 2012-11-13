module.exports = function(grunt) {

  var marked = require('marked');
  var hljs   = require('highlight.js');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.name %> v<%= pkg.version %>\n' +
              '//\n' +
              '// Copyright (c) 2012 <%= pkg.author %>\n' +
              '// Distributed under the <%= pkg.license %> license'
    },
    lint: {
      grunt: 'grunt.js',
      src:   'src/**/!(intro|outro).js',
      dist:  'dist/<%= pkg.name %>.js'
    },
    mocha: {
      src: 'test/index.html'
    },
    concat: {
      dist: {
        src: [
          '<banner>',
          'src/intro.js',
          'src/views/datagrid.js',
          'src/views/header.js', 'src/views/row.js', 'src/views/pagination.js',
          'src/views/cells/cell.js', 'src/views/cells/callback-cell.js', 'src/views/cells/action-cell.js', 'src/views/cells/header-cell.js',
          'src/models/pager.js', 'src/models/sorter.js',
          'src/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Grunt plugins.
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

    html = grunt.template.process(template, {content: html});
    grunt.file.write('index.html', html);
    grunt.log.writeln('File "index.html" created.');
  });

  // Default task and aliases.
  grunt.registerTask('test', 'lint:grunt lint:src mocha');
  grunt.registerTask('dist', 'concat lint:dist min');
  grunt.registerTask('default', 'test dist site');
};
