var gulp = require('gulp'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create();

gulp.task('watch', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "public"
    }
  });

  watch('./public/index.html', function() {
    browserSync.reload();
  });

  watch('./public/assets/styles/**/*.css', function() {
    gulp.start('cssInject');
  });

  watch('./public/assets/scripts/**/*.js', function() {
    gulp.start('scriptsRefresh');
  });

});

gulp.task('cssInject', ['styles'], function() {
  return gulp
  .src('./public/temp/styles/styles.css')
  .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function() {
  browserSync.reload();
});
