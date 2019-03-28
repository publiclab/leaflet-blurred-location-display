module.exports = function(grunt) {

    "use strict";
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options : {
                livereload: true
            },
            source: {
                files: [
                    'src/*.js',
                    'src/*/*.js',
                    'Gruntfile.js'
                ],
                tasks: [ 'build:js' ]
            }
        },

        browserify: {
            dist: {
                src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/leaflet/dist/leaflet.js', 'src/blurredLocationDisplay.js'],
                dest: 'dist/Leaflet.BlurredLocationDisplay.js'
            }
        },

        jasmine: {
          src: ['dist/client/Leaflet.BlurredLocationDisplay.js'],
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: [
             'dist/Leaflet.BlurredLocationDisplay.js',
             'node_modules/jquery/dist/jquery.js',
             'node_modules/bootstrap/dist/js/bootstrap.min.js',
             'node_modules/jasmine-jquery/lib/jasmine-jquery.js' ,
             'node_modules/jasmine-ajax/lib/mock-ajax.js',
             'https://maps.googleapis.com/maps/api/js?libraries=places&language=en&key=AIzaSyDWgc7p4WWFsO3y0MTe50vF4l4NUPcPuwE',
             'node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js'
             ]
          }
        },

        jshint: {
        all: [
            "Gruntfile.js",
            "dist/*.js",
            "spec/**/*.js",
        ],
        options: {
          jshintrc: '.jshintrc'
        },
      },


    });

    /* Default (development): Watch files and build on change. */
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask("default", ["watch", "jasmine"]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask('build', [
        'browserify:dist'
    ]);
  
};
