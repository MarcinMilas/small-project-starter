/**
 * Created by jarek on 01/04/2017.
 */

import gulp from 'gulp';
import sass from 'gulp-sass';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';
import {create as bsCreate} from 'browser-sync';

const browserSync = bsCreate();
const dirs = {
  app: 'app',
  dist: 'dist',
  nodeModules: './node_modules'
};

const sources = {
  styles: `${dirs.app}/**/*.scss`,
  scripts: `${dirs.app}/.tmp/scripts/**/*.js`,
  html: `${dirs.app}/*.html`
};

function compile(watch) {
  var bundler = watchify(browserify(path.join(dirs.app, 'scripts', 'main.js'), { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path.join(dirs.app, '.tmp', 'scripts')));

  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
}

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

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: dirs.app
    }
  });
});

gulp.task('watch', () => {
  gulp.watch(sources.styles, ['sass']);
  gulp.watch(sources.scripts, browserSync.reload);
  gulp.watch(sources.html, browserSync.reload);
  return watch();
});

gulp.task('build', function() { return compile(); });

gulp.task('serve', ['sass', 'browser-sync', 'watch']);

gulp.task('default', ['serve']);