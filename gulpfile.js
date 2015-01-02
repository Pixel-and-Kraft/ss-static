// npm i --save-dev gulp browser-sync gulp-sass gulp-autoprefixer gulp-plumber gulp-csso gulp-rename gulp-sourcemaps gulp-size vinyl-source-stream vinyl-buffer gulp-util watchify browserify gulp-jshint jshint-stylish gulp-uglify del
var gulp          = require('gulp')
var browserSync   = require('browser-sync')
var reload        = require('browser-sync').reload
var sass          = require('gulp-sass')
var autoprefixer  = require('gulp-autoprefixer')
var csso          = require('gulp-csso')
var rename        = require('gulp-rename')
var sourcemaps    = require('gulp-sourcemaps')
var plumber       = require('gulp-plumber')
var size          = require('gulp-size')
var source        = require('vinyl-source-stream')
var buffer        = require('vinyl-buffer')
var gutil         = require('gulp-util')
var watchify      = require('watchify')
var browserify    = require('browserify')
var jshint        = require('gulp-jshint')
var uglify        = require('gulp-uglify')
var del           = require('del')

// ------------------------------------------
// Notes:
// - Two builds: 
//   1) For development (tmp)
//     - unminified 
//     - source mapped
//     - linted
//     - root located in current
//       directory to mirror deployment
//   2) for deployment (ship)
//     - minified
//     - located anywhere, such as in 
//       platform-specific theme locations
// - Browsersynced with included server or 
//   with existing server using a proxy
// - Easy to extend existing tasks.


// Destination for shippable build
// Can be anywhere, relative to current directory
var dest_root = "./../SS-Static/"

// Configuration here:
var config = { 

  // sources
  copy_src:     ['*.hbs', '*.html', '*.md', '*.txt'],
  sass_src:     "assets-src/sass/**/*.{sass,scss}",
  js_src:       "assets-src/js/**/*.js",
  js_src_entry: "./assets-src/js/index.js",
  
  // tmp locations for development
  tmp_js:   "./assets/js",
  tmp_css:  "assets/css",

  // name for single browserified bundle
  bundle_js: "bundle.js",

  // specific destination paths
  dest_js:   dest_root + "assets/js",
  dest_css:  dest_root + "assets/css"
}


// -----------------------
// Watch / Clean

gulp.task('watch', ['copy-ship', 'sass-dev', 'sass-ship', 'jshint', 'browserify', 'js_ship', 'bs'], function() {
  gulp.watch( config.sass_src, ['sass-dev', 'sass-ship'] )
  gulp.watch( config.copy_src, ['copy-ship'] )
  gulp.watch( config.js_src, ['jshint'])
})

gulp.task('clean', function(cb) {
  del([
    dest_root,
    config.tmp_js,
    config.tmp_css
  ], {force: true}, cb)
})


// -----------------------
// Browser Sync

gulp.task('bs', ['sass-dev', 'sass-ship', 'copy-ship'], function() {
  browserSync({
    // Proxy or Server
    // proxy: "localhost:2368",
    server: ({
      baseDir: "./"
    }),
    notify: false,
    open: false,
    logLevel: "info",
    logPrefix: "P&K",
    logFileChanges: false,
    ghostMode: {
        clicks: true,
        location: true,
        forms: true,
        scroll: false
    }
  })
})


// -----------------------
// SASS --> CSS

gulp.task('sass-dev', function() {
  gulp.src( config.sass_src )
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({
        errLogToConsole: true
      }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 9", { cascade: false }))
    .pipe(gulp.dest( config.tmp_css ))
    .pipe(reload({stream:true}))
})
gulp.task('sass-ship', function() {
  gulp.src( config.sass_src )
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 9", { cascade: false }))
    .pipe(csso())
    .pipe(size({
      showFiles: true,
      title: "Size css-min:"
    }))
    .pipe(gulp.dest( config.dest_css ))
    .pipe(reload({stream:true}))
})


// -----------------------
// Copy
// (eg: .html, .template, .md, .txt, etc)

gulp.task('copy-ship', function() {
  return gulp.src(config.copy_src)
  .pipe(gulp.dest( dest_root ))
  .pipe(reload({stream:true}))
})


// -----------------------
// Js --> single bundle

var bundler = watchify(browserify(config.js_src_entry, {
  cache: {},
  packageCache: {},
  fullPaths: true,
  debug: true
}))

// wait for JsHint, then Browserify
gulp.task('browserify', ['jshint'], bundle)

bundler.on('update', bundle)

function bundle() {
  return bundler.bundle() 
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source( 'bundle.js' ))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( config.tmp_js ))
    .pipe(reload({stream:true}))
}

gulp.task('js_ship', ['browserify'], function() {
  return gulp.src( config.tmp_js + "/**/*.js")
    .pipe(uglify())
    .pipe(size({
      showFiles: true,
      title: "Size js-min:",
    }))
    .pipe(gulp.dest( config.dest_js ))
})

gulp.task('jshint', function() {
  return gulp.src( config.js_src )
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})