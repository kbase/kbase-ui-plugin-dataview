/*eslint-env node*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            dagre: {
                expand: true,
                flatten: true,
                src: 'node_modules/dagre/dist/dagre.js',
                dest: '../src/plugin/iframe_root/modules/vendor/dagre'
            },
            preact: {
                expand: true,
                flatten: true,
                src: 'node_modules/preact/dist/preact.umd.js',
                dest: '../src/plugin/iframe_root/modules/vendor/preact'
            },
            htm: {
                expand: true,
                flatten: true,
                src: 'node_modules/htm/dist/htm.umd.js',
                dest: '../src/plugin/iframe_root/modules/vendor/htm'
            },
            leaflet: {
                expand: true,
                flatten: false,
                cwd: 'node_modules/leaflet/dist',
                src: [
                    'leaflet-src.js',
                    'leaflet.css',
                    'images/*',
                ],
                dest: '../src/plugin/iframe_root/modules/vendor/leaflet'
            },
            requirejsJson: {
                expand: true,
                flatten: false,
                cwd: 'node_modules/requirejs-json',
                src: [
                    'json.js'
                ],
                dest: '../src/plugin/iframe_root/modules/vendor/requirejs-json'
            }
        },
        clean: {
            options: {
                force: true
            },
            vendor: '../src/plugin/iframe_root/modules/vendor/*',
            bower: './bower_components/',
            npm: './node_modules/'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
};
