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
          dest: 'temp'
          ext: '.js'
        }]
    stylus:
      default:
        files:
          "temp\/app.css": "src\/**\/*.stylus"
    clean:
      build: 'build'
    concat:
      js:
        src: ['src/jquery.sumoselect.js', 'temp/index.js']
        dest: 'build/index.js'
      css:
        src: ['src/sumoselect.css', 'temp/app.css']
        dest: 'build/app.css'
    nodeunit:
      tests: ['build/test/**/*.js']
  grunt.registerTask 'build', [
    'clean:build'
    'coffee'
    'stylus'
    'concat'
  ]
  grunt.registerTask 'default', [
    'build'
    'watch'
  ]
  grunt.registerTask 'test', [
    'build'
    'nodeunit'
  ]