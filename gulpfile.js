var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    bump = require('gulp-bump'),
    notify = require('gulp-notify'),
    git = require('gulp-git'),
    size = require('gulp-size');

var paths = {
  src: ['./src/*.js'],
  dist: ['./dist/*.js'],
};

var sourceDest = 'angular-push.js';
var sourceMin = 'angular-push.min.js';

gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('preBuild', ['lint'], function() {
  return gulp.src(paths.src)
    .pipe(concat(sourceDest))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['preBuild'], function() {
  return gulp.src(sourceDest)
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest('dist'))
    .pipe(notify('Build finished'));
});

gulp.task('bump', function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: gulp.env.type}))
    .pipe(gulp.dest('./'));
});

gulp.task('publish',['bump'], function () {
  var pkg = require('./package.json');
  var msg = 'Bumps version '+pkg.version;
  gulp.src('./*.json')
    .pipe(git.add())
    .pipe(git.commit(msg));

    setTimeout(function () {
      git.tag('v'+pkg.version, msg, function(){});
    }, 1000);
});
