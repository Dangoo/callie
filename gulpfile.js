const gulp = require('gulp');
const babel = require('rollup-plugin-babel');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const header = require('gulp-header');

const pkg = require('./package.json');

const postcss = require('gulp-postcss');
const postcssImport = require("postcss-import");
const potscssCssNext = require("postcss-cssnext");

const banner = `/**
* ${pkg.name} - ${pkg.description}
* @version v${pkg.version}
* @license ${pkg.license}
*/
`;

const distPath = './dist';

gulp.task('datepicker', () => {
  return rollup({
      entry: './src/scripts/index.js',
      format: 'umd',
      moduleName: 'callie',
      plugins: [ babel() ],
    })
    .pipe(source('index.js'))
    .pipe(header(banner, { pkg } ))
    .pipe(gulp.dest(distPath));
});

gulp.task('library', () => {
  return rollup({
      entry: './src/scripts/library.js',
      format: 'umd',
      moduleName: 'callieLib',
      plugins: [ babel() ],
    })
    .pipe(source('lib.js'))
    .pipe(header(banner, { pkg } ))
    .pipe(gulp.dest(distPath));
});

gulp.task('css', function () {
    var processors = [
        postcssImport(),
        potscssCssNext()
    ];
    return gulp.src('./src/styles/index.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
  gulp.watch('./src/scripts/**/*.js', ['datepicker', 'library']);
  gulp.watch('./src/styles/**/*.css', ['css']);
});

gulp.task('default', ['datepicker', 'library', 'css']);
