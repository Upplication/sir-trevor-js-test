var gulp = require('gulp');
var gutil = require("gulp-util");
var bower = require('gulp-bower');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var webpack = require('webpack');
var path = require("path");
var WebpackDevServer = require('webpack-dev-server');

var vendorPaths = [
        'bower_components/jquery/jquery.min.js',
        'bower_components/sir-trevor-js/sir-trevor.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js'
    ];

var vendorCSSPaths = [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/sir-trevor-js/sir-trevor.css'
    ];

gulp.task('vendor', function () {
    gulp.src(vendorPaths)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));

      gulp.src(vendorCSSPaths)
          .pipe(concat('vendor.min.css'))
          .pipe(minifyCSS({keepBreaks: false}))
          .pipe(gulp.dest("dist"));
});

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack({
        entry: "./src/js/main.js",
        output: {
          path: path.join(__dirname, "dist"),
          filename: 'main.min.js',
        },
        resolve: {
          extensions: ['','.js']
        },
        hot: true,
        historyApiFallback: true
    });

    new WebpackDevServer(compiler, {
        // server and middleware options
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        // keep the server alive or continue?
        callback();
    });
});

gulp.task('default', ['vendor', 'webpack-dev-server']);
