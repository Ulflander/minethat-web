/*jslint node:true*/

(function() {

    'use strict';

        /**
         * Minimum maintainability value for build to pass.
         *
         * @type {Number}
         */
    var MIN_MAINTAINABILITY = 65,

        /**
         * Minimum maintainability value for a file for build to pass.
         *
         * @type {Number}
         */
        F_MIN_MAINTAINABILITY = 55,

        WATCHING = false,

        gulp = require('gulp'),
        stacks = require('./gulp-stack.js'),
        fs = require('fs'),
        sass = require('gulp-sass'),
        markdown = require('gulp-markdown'),
        cssmin = require('gulp-cssmin'),
        clean = require('gulp-clean'),
        jslint = require('gulp-jslint'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        filesize = require('gulp-filesize'),
        plato = require('gulp-plato'),
        gccompiler = require('gulp-closure-compiler');







    /**
     * Run Quality Assurance tools on server files.
     *
     * - JSHint
     * - Google closure compiler
     * - Plato
     */
    gulp.task('qa-js', function() {
        return gulp.src([
                'src/server/*.js',
                'src/server/**/*.js',
            ])
            .pipe(filesize())
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jslint({
                node: true,
                unparam: true,
                nomen: true,
                maxlen: 80,
                white: true,
                indent: 4
            }))
            .pipe(plato('dist/private/plato-web', {
                jshint: {
                    options: {
                        strict: true
                    },
                    complexity: {
                        trycatch: true
                    }
                }}))
            .pipe(gccompiler({
              compilerPath: '../utils/gclosure-compiler.jar',
              fileName: 'test.js'
            }))
            .pipe(gulp.dest('dist'));
    });

    /**
     * Once Quality Automation checks done, open and read plato report.
     * Build fails if maintainability is less than MIN_MAINTAINABILITY.
     */
    gulp.task('qa-js-validation', ['qa-js'], function() {


        if (!fs.existsSync('dist/private/plato-web/report.json')) {
            console.error('No plato report available - build failed.');
            if(!WATCHING) {
                process.exit(1);
            }
        }

        // Read plato reports, cancel build if maintainability < 80%
        var platoReport = JSON.parse(
            fs.readFileSync('dist/private/plato-web/report.json').toString()),
            files = platoReport.reports,
            i,
            l = files.length,
            failedAverage = false,
            failedFile = false;

        if (platoReport.summary.average.maintainability < MIN_MAINTAINABILITY) {
            console.error('\nJS code not sufficiently maintainable in average: '
                + parseInt(platoReport.summary.average.maintainability, 10) + '%');
            failedAverage = true;
        } else {
            console.error('\nAcceptable average maintainability: '
                + parseInt(platoReport.summary.average.maintainability, 10) + '%');
        }

        for (i = 0; i < l; i += 1) {
            if (files[i].complexity.maintainability
                < MIN_MAINTAINABILITY) {

                if (failedAverage) {
                    console.log('     File ' + files[i].info.file + ': '
                        + parseInt(files[i].complexity.maintainability, 10)
                        + '%');
                }
            }

            if (files[i].complexity.maintainability
                < F_MIN_MAINTAINABILITY) {
                failedFile = true;

                console.error('File ' + files[i].info.file
                    + ' not sufficiently maintainable: '
                    + parseInt(files[i].complexity.maintainability, 10)
                    + '%');
            }
        }

        if ((failedAverage || failedFile) && !WATCHING) {
            process.exit(1);
        }

        return gulp.src('gulp-stack.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });


    gulp.task('clean', function() {
        return gulp.src(['dist/js/', 'dist/css/'])
            .pipe(clean());
    });

    gulp.task('sass', function() {
        return gulp.src('src/client/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/client/vendors/css-gen'));
    });

    gulp.task('build-css', ['sass'], function(cb) {
        for (var k in stacks.stacks) {
            gulp.src(stacks.get(k, 'css'))
                .pipe(cssmin())
                .pipe(concat(k + '.css'))
                .pipe(gulp.dest('dist/css/'))
                .pipe(filesize());
        }

        cb();
    });

    gulp.task('build-js', ['qa-js', 'qa-js-validation'], function(cb) {
        for (var k in stacks.stacks) {
            gulp.src(stacks.get(k, 'js'))
                .pipe(concat(k + '.js'))
                .pipe(gulp.dest('dist/js/'))
                .pipe(uglify())
                .pipe(gulp.dest('dist/js/'))
                .pipe(filesize());
        }

        cb();
    });

    gulp.task('build-js-no-check', function(cb) {
        for (var k in stacks.stacks) {
            gulp.src(stacks.get(k, 'js'))
                .pipe(concat(k + '.js'))
                .pipe(gulp.dest('dist/js/'))
                .pipe(uglify())
                .pipe(gulp.dest('dist/js/'))
                .pipe(filesize());
        }

        cb();
    });


    gulp.task('default', ['clean', 'qa-js', 'qa-js-validation', 'build-js', 'build-css']);

    gulp.task('dev', ['clean', 'build-js-no-check', 'build-css']);


    gulp.task('watch', function() {
        WATCHING = true;
        gulp.watch('src/client/js/*.js', ['qa-js-validation', 'build-js']);
        gulp.watch('src/client/vendors/js/*.js', ['qa-js-validation', 'build-js']);

        gulp.watch('src/client/scss/*', ['sass', 'build-css']);
        gulp.watch('src/client/vendors/css/*.css', ['build-css']);
    });

}());
