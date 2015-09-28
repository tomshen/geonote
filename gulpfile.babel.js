import gulp from 'gulp';

// General
import concat from 'gulp-concat';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';

// JavaScript
import babelify from 'babelify';
import browserify from 'browserify';
import debowerify from 'debowerify';
import vinylBuffer from 'vinyl-buffer';
import vinylSource from 'vinyl-source-stream';
import watchify from 'watchify';

// CSS
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnext from 'cssnext';
import postcss from 'gulp-postcss';

const appName = 'geonote';

const dirs = {
  dest: 'build',
  src: 'src',
};

const cssSrc = `${ dirs.src }/css/**/*.css`;
const jsSrc = `${ dirs.src }/js/main.js`;

gulp.task('default', [
  'javascript',
  'css',
]);

gulp.task('css', () => {
  const processors = [
    atImport(),
    autoprefixer({
      browsers: [
        'last 3 versions'
      ],
    }),
    cssnext(),
  ];

  return gulp.src(cssSrc)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(concat(`${ appName }.css`))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.dest));
});

const jsBundler = browserify(jsSrc, {
  debug: true,
}).transform(babelify.configure({
    ignore: [
      'bower_components/**',
    ],
  }))
  .transform(debowerify);

let bundleJs = (bundler) => {
  return bundler.bundle()
    .on('error', (err) => {
      gutil.log('Browserify Error', err.message);
    })
    .pipe(vinylSource(`${ appName }.js`))
    .pipe(vinylBuffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dirs.dest));
};

gulp.task('javascript', () => bundleJs(jsBundler));

gulp.task('watch', ['css'], () => {
  gulp.watch(cssSrc, [
    'css',
  ]);

  const jsWatcher = watchify(jsBundler);
  bundleJs(jsWatcher);
  jsWatcher.on('update', () => bundleJs(jsWatcher));
  jsWatcher.on('log', gutil.log);
});
