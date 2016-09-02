/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Gruntfile.js 3107 2015-05-26 18:22:54Z tgaskins $
 */
module.exports = function (grunt) {
    grunt.initConfig({
        connect:{
            options: {
            base: ['.'],

            port: 9050,
            hostname: 'localhost',
            livereload: 35729
          },
          livereload: {
            options: {
              open: true,
              base: ['.']
            }
          }
        },

        watch: {
            options: {
                livereload: 35729,
            },
            sources: {
                files: ['*.js', '*.html', '*.css']
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    out: './apps/worldwindlib.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['requirejs']);
    grunt.registerTask('server', ['connect', 'watch']);




};
