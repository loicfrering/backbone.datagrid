module.exports = function(grunt) {

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
          'src/models/*.js',
          'src/views/cell.js', 'src/views/callback-cell.js', 'src/views/action-cell.js', 'src/views/header-cell.js',
          'src/views/header.js', 'src/views/row.js', 'src/views/pagination.js',
          'src/views/datagrid.js',
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

  // Grunt plugins.@
  grunt.loadNpmTasks('grunt-mocha');

  // Default task.
  grunt.registerTask('test', 'lint:grunt lint:src mocha');
  grunt.registerTask('dist', 'concat lint:dist min');
  grunt.registerTask('default', 'test dist');
};
