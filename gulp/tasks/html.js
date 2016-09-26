var gulp = require('gulp')
var jade = require('gulp-jade')
var config = require('../config/config')

gulp.task('html', [ 'js', 'css' ], function () {
  return gulp
    .src(config.paths.src.templates)
    .pipe(jade(config.options.html.jade))
    .pipe(gulp.dest(config.paths.dest.dist))
})
