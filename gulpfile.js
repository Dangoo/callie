const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('@rollup/plugin-typescript');

const postcss = require('gulp-postcss');
const postcssAtImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');

const distPath = './dist';

gulp.task('datepicker', () => {
  return rollup.rollup({
    input: './src/scripts/index.js',
    plugins: [rollupTypescript()],
  }).then(bundle => {
    return bundle.write({
      file: './dist/index.js',
      format: 'umd',
      name: 'callie',
      sourcemap: true
    });
  })
});

gulp.task('library', () => {
  return rollup.rollup({
    input: './src/scripts/library.js',
    plugins: [rollupTypescript()],
  }).then(bundle => {
    return bundle.write({
      file: './dist/lib.js',
      format: 'umd',
      name: 'callieLib',
      sourcemap: true
    });
  })
});

gulp.task('css', function () {
  var processors = [
    postcssAtImport(),
    postcssPresetEnv()
  ];
  return gulp.src('./src/styles/index.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
  gulp.watch('./src/scripts/**/*.js', gulp.parallel('datepicker', 'library'));
  gulp.watch('./src/styles/**/*.css', gulp.parallel('css'));
});

gulp.task('default', gulp.parallel('datepicker', 'library', 'css'));
