const gulp = require('gulp');
const rename = require("gulp-rename");
const es = require('event-stream');
const rimraf = require('rimraf');
const gulpRimraf = require('gulp-rimraf');


gulp.task('clean', function(cb) {
	rimraf('./build', cb);
});

gulp.task('default', function() {
	let tasks = [];
	tasks = [gulp.src(['package.json', 'process.json'])
		.pipe(gulp.dest('build')),

		gulp.src(['config/config.production.json'])
		.pipe(gulp.dest('build/config')),

		gulp.src(['src/modules/util/component-code.js','src/modules/util/component-code-util.js'])
		.pipe(gulp.dest('build/src/modules/util/')),

		gulp.src(['sql/**/*'])
		.pipe(gulp.dest('build/sql'))
	];
	return es.merge(tasks);
});