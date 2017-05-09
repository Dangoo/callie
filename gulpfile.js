const gulp = require('gulp');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const header = require('gulp-header');

const pkg = require('./package.json');

const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const potscssCssNext = require('postcss-cssnext');

const banner = `/**
* ${pkg.name} - ${pkg.description}
* @version v${pkg.version}
* @license ${pkg.license}
* @repository ${pkg.repository.url}
*/
`;

const distPath = './dist';
const rollupDefaultConfig = {
	format: 'umd',
	moduleName: 'callie',
	plugins: [babel(), nodeResolve(), commonjs()]
};

gulp.task('datepicker', () => {
	return rollup(Object.assign(
		{},
		rollupDefaultConfig,
		{entry: './src/scripts/index.js'}
	))
		.pipe(source('index.js'))
		.pipe(header(banner, {pkg}))
		.pipe(gulp.dest(distPath));
});

gulp.task('library', () => {
	return rollup(Object.assign(
		{},
		rollupDefaultConfig,
		{entry: './src/scripts/library.js'}
	))
		.pipe(source('lib.js'))
		.pipe(header(banner, {pkg}))
		.pipe(gulp.dest(distPath));
});

gulp.task('css', () => {
	const processors = [
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
