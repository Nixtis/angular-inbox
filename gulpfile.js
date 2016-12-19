//Gulp modules
let gulp = require('gulp'),
	connect = require('gulp-connect'),
    history = require('connect-history-api-fallback'),
	open = require('gulp-open'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    plumber = require('gulp-plumber')

//Config
let environment = 'local', //(local|prod)
	host = 'localhost',
	port = '8888'

//Gulp tasks
gulp.task('connectTask', connectTask)
gulp.task('openTask', openTask)
gulp.task('cleanEnvironment', cleanEnvironment)
gulp.task('local', localTask)
gulp.task('tsTask', tsTask)
gulp.task('moveFiles', moveFiles)

///////////////

/**
 * Sync modifications to browser
 */
function connectTask () {
	var parameters = {
		host: host,
		port: port,
		root: environment,
		livereload: true,
        middleware: function () {
            return [ history() ]
        }
	};

	connect.server(parameters)
}

/**
 * Open browser
 */
function openTask () {
	var parameters = {
		uri: `http://${host}:${port}`
	}

	return gulp
		.src(__filename)
		.pipe(open(parameters))
}

/**
 * Watch
 */
function watchTask() {
    watch('sources/**/*.ts', tsTask)
    watch('sources/**/*.html', moveFiles)
}

/**
 * Clean environment folder
 */
function cleanEnvironment () {
    return gulp
        .src(environment, { read: false })
        .pipe(clean({ force: true }))
}

/**
 * Typescript
 */
function tsTask () {
    return browserify({
        basedir: '.',
        debug: environment === 'local',
        entries: [ 'sources/main.ts' ],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(environment))
    .pipe(connect.reload())
}

/**
 * Move files
 */
function moveFiles () {
    return gulp
        .src([
            'sources/index.html',
            'sources/img/*',
            'node_modules/angular-material/angular-material.css',
            'node_modules/angular-material-icons/angular-material-icons.css',
        ])
        .pipe(gulp.dest(environment))
        .pipe(connect.reload())
}

/**
 * All tasks
 */
function runAllTasks() {
    runSequence('cleanEnvironment', 'tsTask', moveFiles)
}

/**
 * Set Local environment
 */
function localTask() {
    environment = 'local'

    runAllTasks()
    connectTask()
    openTask()
    watchTask()
}



/**
 * Set Prod environment
 */
function prodTask() {
    environment = 'prod'

    runAllTasks()
}
