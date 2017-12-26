const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require('gulp-babel');

const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));

// Make it as a util, since used in multiple place
var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);
const buildType = majorVer < 8 ? 'legacy' : 'modern';

gulp.task('build-legacy', function() {
  const base = path.join(__dirname, 'dist/legacy');
  gulp
    .src('src/**/*.js')
    .pipe(babel(babelrc.env.legacy))
    .pipe(gulp.dest(base));
});

gulp.task('build-modern', function() {
  const base = path.join(__dirname, 'dist/modern');
  gulp
    .src('src/**/*.js')
    .pipe(babel(babelrc.env.modern))
    .pipe(gulp.dest(base));
});

gulp.task('watch', function() {
  watch('src/**/*.js', { debounceDelay: 200 }, function() {
    if (buildType === 'legacy') {
      gulp.start('build-legacy');
    } else {
      gulp.start('build-modern');
    }
  });
});
