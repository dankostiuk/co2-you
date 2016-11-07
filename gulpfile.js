var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ts = require('gulp-typescript');

// uglifies js
gulp.task('uglify', function () {
    gulp.src('app/*.js')
        .pipe(uglify())
        .pipe(concat('all-ugly.js'))
        .pipe(gulp.dest('app'));
});

// compiles ts to js - don't use this since tsc performs better
gulp.task('ts-compile', function () {
	return gulp.src('app/*.ts')
	    .pipe(ts({
	        noImplicitAny: true
	    }))
	    .pipe(gulp.dest('app'));
});

// runs server with proxy to allow rest calls to 8080
gulp.task('webserver', function() {
	connect.server({
		port: process.env.PORT || 5000,
		debug: true,
		livereload: true,
		middleware: function(req, res, next) {
			return [(function() {
				var url = require('url');
		        var proxy = require('proxy-middleware');
		        var options = url.parse('https://co2-you-api.herokuapp.com/rest');
		        options.route = '/rest';
		        return proxy(options);
			})(),
				(function() {
					var url = require('url');
					var parse = require('url-parse');
					var parsed = parse('https://co2-you.herokuapp.com/#/home');
					parsed.set('pathname', '/#/home')
					parsed.set('hash', '')

					var proxy = require('proxy-middleware');
					//var parsed = url.parse('https://co2-you.herokuapp.com/#/home');
					parsed.route = '/auth';
					return proxy(options2);
				})()
			];
	    }
	});
});

gulp.task('default', ['webserver']);
