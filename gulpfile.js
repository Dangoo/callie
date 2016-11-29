const gulp = require('gulp');
const babel = require("gulp-babel");
const paeckchen = require('gulp-paeckchen').paeckchen;

var postcss = require('gulp-postcss');
var postcssImport = require("postcss-import");
var potscssCssNext = require("postcss-cssnext");

const distPath = './dist';

function bundler() {
  return paeckchen({
    entryPoint: './src/scripts/index.js',
    outputFile: 'index.js',
    logLevel: 'trace'
  });
}

gulp.task('js', () => {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(babel())
    .pipe(bundler())
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
  gulp.watch('./src/scripts/**/*.js', ['js']);
  gulp.watch('./src/styles/**/*.css', ['css']);
});

gulp.task('default', ['js', 'css']);
