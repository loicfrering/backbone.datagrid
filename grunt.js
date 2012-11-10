module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      src:   'src/**/*.js',
      grunt: 'grunt.js'
    },
    mocha: {
      all: ['test/index.html']
    },
    concat: {
      dist: {
        src: [
          'src/models/*.js',
          'src/views/cell.js', 'src/views/callback-cell.js', 'src/views/action-cell.js', 'src/views/header-cell.js',
          'src/views/header.js', 'src/views/row.js', 'src/views/pagination.js',
          'src/views/datagrid.js'
        ],
        dest: 'dist/backbone.datagrid.js'
      }
    },
    min: {
      dist: {
        src: 'dist/backbone.datagrid.js',
        dest: 'dist/backbone.datagrid.min.js'
      }
    }
  });

  // Grunt plugins.@
  grunt.loadNpmTasks('grunt-mocha');

  // Default task.
  grunt.registerTask('test', 'lint mocha');
  grunt.registerTask('dist', 'concat min');
  grunt.registerTask('default', 'lint mocha concat min');
};
