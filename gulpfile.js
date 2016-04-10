var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var git = require('gulp-git');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();

gulp.task('sass', function () {
  return gulp.src("src/scss/style.scss")
    .pipe(sass())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task('jade', function () {
  gulp.src('./src/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

gulp.task('commit', function () {
  git.exec({args: 'add -A'}, function (err, stdout) {
    git.exec({args: 'diff --name-status --cached --raw'}, function (err, stdout) {
      var message = stdout.replace(/\t/g, " - ").replace(/\n/g, ";\n");
      git.exec({args: 'commit -m "' + message + '"'}, function (err, stdout) {
        console.log(err);
        console.log(stdout);
      });
    });
  });
});

gulp.task('pull', function () {
  git.exec({args: 'pull'}, function (err, stdout) {
    console.log(err);
    console.log(stdout);
  });
});

gulp.task('push', function () {
  git.exec({args: 'push origin develop'}, function (err, stdout) {
    console.log(err);
    console.log(stdout);
  });
});

gulp.task('watcher', function () {
  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch("src/jade/**/*.jade", ['jade']);
});

// Static Server + watching scss/jade files
gulp.task('serve', ['sass', 'jade'], function () {

  browserSync.init({
    server: "./dist",
    browser: ["firefox"]
  });

  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch("src/jade/**/*.jade", ['jade']);
  gulp.watch("dist/*.html").on('change', browserSync.reload);
  gulp.watch("dist/css/*.css").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);
