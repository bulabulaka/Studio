
// *** dependencies *** //

const path = require('path');
const gulp = require('gulp');
// const jshint = require('gulp-jshint');
// const jscs = require('gulp-jscs');
// const runSequence = require('run-sequence');
// const nodemon = require('gulp-nodemon');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const server = require('tiny-lr')();
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

import * as knexConfig from './knexfile';
import * as Knex from 'knex';
const environment = 'development';
// *** config *** //

const paths = {
  allJsScripts: [
    path.join('src', '**', '*.js'),
    path.join('src', '*.js')
  ],
  allTsScripts: [
    path.join('src', '**', '*.ts'),
    path.join('src', '*.ts')
  ],
  dbTsScripts: [
    path.join(__dirname, 'gulpfile.ts'),
    path.join(__dirname, 'knexfile.ts'),
    path.join('src', 'db', '**', '*.ts')
  ],
  styles: [
    path.join('src', 'client', 'css', '*.css')
  ],
  server: path.join('src', 'server', 'server.js')
};

const lrPort = 35729;

const nodemonConfig = {
  script: paths.server,
  ext: 'html js css',
  ignore: ['node_modules'],
  env: {
    NODE_ENV: 'development'
  }
};

// *** default task *** //

// gulp.task('default', () => {
//   runSequence(
//     ['nodemon'],
//     ['watch']
//   );
// });

// *** sub tasks ** //
gulp.task('tsc db', () => {
  return gulp.src(paths.dbTsScripts)
  .pipe(ts())
  .pipe(gulp.dest(function(file) {
    return file.base; })
  );
});

// gulp.task('jshint', () => {
//   return gulp.src(paths.scripts)
//     .pipe(plumber())
//     .pipe(jshint({
//       esnext: true
//     }))
//     .pipe(jshint.reporter('jshint-stylish'))
//     .pipe(jshint.reporter('fail'));
// });

// gulp.task('jscs', () => {
//   return gulp.src(paths.scripts)
//     .pipe(plumber())
//     .pipe(jscs())
//     .pipe(jscs.reporter())
//     .pipe(jscs.reporter('fail'));
// });

gulp.task('tsc all', () => {
  return gulp.src(paths.allTsScripts)
    .pipe(ts())
    .pipe(gulp.dest(function(file) {
      return file.base; })
    )
});

gulp.task('migrate db', ['tsc db'], () => {
  const knex: Knex = Knex(knexConfig[environment]);

  knex.migrate.latest().then(() => {
    gutil.log('migration finished.')
    knex.seed.run().then(() => {
      gutil.log('seed run finished: ');
      return knex.migrate.currentVersion();
    }).then((version) => {
      gutil.log('Kicked database to version: ' + version);
      knex.destroy();
    });
  });
});

gulp.task('rollback db', ['tsc db'], () => {
  const knex: Knex = Knex(knexConfig[environment]);

  knex.migrate.rollback().then(() => {
      return knex.migrate.currentVersion();
    }).then((version) => {
      gutil.log('Kicked database to version: ' + version);
      knex.destroy();
    });
});

// gulp.task('nodemon', () => {
//   return nodemon(nodemonConfig);
// });

// gulp.task('watch', () => {
//   gulp.watch(paths.html, ['html']);
//   gulp.watch(paths.scripts, ['jshint', 'jscs']);
//   gulp.watch(paths.styles, ['styles']);
// });

