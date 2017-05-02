var gulp = require('gulp'),
watch = require('gulp-watch'),
nodemon = require('gulp-nodemon');
browserSync = require('browser-sync').create();

gulp.task('watch', function() {
  gulp.start('nodemon');
  watch('./public/assets/styles/**/*.css', function() {
    gulp.start('styles');
  });
  watch('./public/assets/scripts/**/*.js', function() {
    gulp.start('scripts');
  });
});

gulp.task('nodemon', function (cb) {
  var started = false;

  return nodemon({
    script: 'server/server.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});
