module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      src:   'src/**/*.js',
      grunt: 'grunt.js'
    },
    mocha: {
      all: ['test/index.html']
    }
  });

  // Grunt plugins.@
  grunt.loadNpmTasks('grunt-mocha');

  // Default task.
  grunt.registerTask('test', 'lint mocha');
  grunt.registerTask('default', 'lint mocha');
};
