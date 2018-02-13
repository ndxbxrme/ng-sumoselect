module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.initConfig
    express:
      web:
        options:
          script: 'build/test.js'
    watch:
      coffee:
        files: ['src/**/*.*']
        tasks: ['build']
    coffee:
      options:
        sourceMap: true
      default:
        files: [{
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: 'build'
          ext: '.js'
        }]
    stylus:
      default:
        files:
          "build\/app.css": "src\/**\/*.stylus"
    clean:
      build: 'build'
    nodeunit:
      tests: ['build/test/**/*.js']
  grunt.registerTask 'build', [
    'clean:build'
    'coffee'
    'stylus'
  ]
  grunt.registerTask 'default', [
    'build'
    'watch'
  ]
  grunt.registerTask 'test', [
    'build'
    'nodeunit'
  ]