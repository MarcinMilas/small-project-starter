/**
 * Created by jarek on 01/04/2017.
 */

import gulp from 'gulp';
import sass from 'gulp-sass';
import path from 'path';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import {create as bsCreate} from 'browser-sync';

const browserSync = bsCreate();
const dirs = {
  app: 'app',
  dist: 'dist',
  nodeModules: './node_modules'
};

const sources = {
  styles: `${dirs.app}/**/*.scss`,
  scripts: `${dirs.app}/**/*.js`,
  html: `${dirs.app}/*.html`
};

gulp.task('watch', () => {
  gulp.watch(sources.styles, ['sass']);
  gulp.watch(sources.scripts, browserSync.reload);
  gulp.watch(sources.html, browserSync.reload);

});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: dirs.app
    }
  });
});


gulp.task('sass', () => {
  return gulp.src(sources.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'compressed',
      includePaths: [
        dirs.nodeModules
      ]
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(dirs.app, '.tmp')))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src(sources.scripts)
    .pipe(babel())
    .pipe(gulp.dest(path.join(dirs.app, '.tmp')))
});



gulp.task('serve', ['sass', 'scripts', 'browser-sync', 'watch']);

gulp.task('default', ['serve']);