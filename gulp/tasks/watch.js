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

  // browserSync.init({
  //   notify: false,
  //   server: {
  //     baseDir: "public"
  //   }
  // });
  //
  // watch('./public/index.html', function() {
  //   browserSync.reload();
  // });
  //
  // watch('./public/assets/styles/**/*.css', function() {
  //   gulp.start('cssInject');
  // });
  //
  // watch('./public/assets/scripts/**/*.js', function() {
  //   gulp.start('scriptsRefresh');
  // });

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

// gulp.task('cssInject', ['styles'], function() {
//   return gulp
//   .src('./public/temp/styles/styles.css')
//   .pipe(browserSync.stream());
// });
//
// gulp.task('scriptsRefresh', ['scripts'], function() {
//   browserSync.reload();
// });
