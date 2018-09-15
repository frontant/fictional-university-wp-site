// dummy comment
var gulp = require('gulp'),
        settings = require('./settings'),
        webpack = require('webpack'),
        browserSync = require('browser-sync').create(),
        postcss = require('gulp-postcss'),
        rgba = require('postcss-hexrgba'),
        autoprefixer = require('autoprefixer'),
        cssvars = require('postcss-simple-vars'),
        nested = require('postcss-nested'),
        cssImport = require('postcss-import'),
        mixins = require('postcss-mixins'),
        colorFunctions = require('postcss-color-function'),
        changed = require('gulp-changed'),
        watch = require('gulp-watch'),
        batch = require('gulp-batch');

gulp.task('deploy',
        ['plugins',
            'copy-res',
            'php',
            'styles',
            'scripts'], function (cb) {
    cb();
});

gulp.task('plugins', function () {
    return gulp.src(settings.pluginsSourceCode + '**/*.php', {base: settings.pluginsSourceCode})
            .pipe(changed(settings.pluginsLocation))
            .on('error', (error) => console.log(error.toString()))
            .pipe(gulp.dest(settings.pluginsLocation));
});

gulp.task('copy-res', function () {
    return gulp.src([settings.themeSourceCode + 'images/**'], {base: settings.themeSourceCode})
            .pipe(changed(settings.themeLocation))
            .on('error', (error) => console.log(error.toString()))
            .pipe(gulp.dest(settings.themeLocation));
});

gulp.task('php', function () {
    return gulp.src(settings.themeSourceCode + '**/*.php', {base: settings.themeSourceCode})
            .pipe(changed(settings.themeLocation))
            .on('error', (error) => console.log(error.toString()))
            .pipe(gulp.dest(settings.themeLocation));
});

gulp.task('styles', function () {
    return gulp.src(settings.themeSourceCode + 'css/style.css', {base: settings.themeSourceCode + 'css'})
            .pipe(postcss([cssImport, mixins, cssvars, nested, rgba, colorFunctions, autoprefixer]))
            .on('error', (error) => console.log(error.toString()))
            .pipe(gulp.dest(settings.themeLocation));
});

gulp.task('scripts', function (callback) {
    webpack(require('./webpack.config.js'), function (err, stats) {
        if (err) {
            console.log(err.toString());
        }

        console.log(stats.toString());
        callback();
    });
});

gulp.task('watch', ['deploy'], function () {
    browserSync.init({
        notify: false,
        proxy: settings.urlToPreview,
        ghostMode: false,
        localOnly: true,
        open: false,
        online: false,
        xip: false,
        tunnel: null
    });


    watch(settings.pluginsSourceCode + '**/*.php', batch(function (events, done) {
        gulp.start('waitForPlugins', done);
    }));

    watch(settings.themeSourceCode + '**/*.php', batch(function (events, done) {
        gulp.start('waitForPhp', done);
    }));

    watch(settings.themeSourceCode + 'css/**/*.css', batch(function (events, done) {
        gulp.start('waitForStyles', done);
    }));

    watch([settings.themeSourceCode + 'js/modules/*.js',
        settings.themeSourceCode + 'js/scripts.js'], batch(function (events, done) {
        gulp.start('waitForScripts', done);
    }));
});

gulp.task('waitForPlugins', ['plugins'], function () {
    browserSync.reload();
});

gulp.task('waitForPhp', ['php'], function () {
    browserSync.reload();
});

gulp.task('waitForStyles', ['styles'], function () {
    return gulp.src(settings.themeLocation + 'style.css')
            .pipe(browserSync.stream());
});

gulp.task('waitForScripts', ['scripts'], function () {
    browserSync.reload();
});
