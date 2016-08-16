/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Gruntfile.js 3107 2015-05-26 18:22:54Z tgaskins $
 */
module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc: {
            dist: {
                src: ['src'],
                options: {
                    destination: 'api-doc',
                    configure: 'config.json',
                    readme: 'README.md',
                    recurse: true
                }
            }
        },

        remove_usestrict: {
            dist: {
                files: [
                    {
                        expand: true,
                        dest: 'src-modified/',
                        src: ['src/**/*.js']
                    }
                ]
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    out: './apps/WorldWeather/worldwindlib.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-remove-usestrict');

    grunt.registerTask('default', ['requirejs']);
};
