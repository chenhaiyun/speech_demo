var gulp = require('gulp');

var url = require('url');
var proxy = require('proxy-middleware');


//var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();

// Static Server + watching scss/html files
gulp.task('serve', function () {
    var proxyOptions = url.parse('https://iot-bb-conversation-v10.eu-gb.mybluemix.net/');
    //var proxyOptions = url.parse('http://devopsci.paas.cmbchina.cn/');
    //var proxyOptions = url.parse('http://localhost:8080/CD/');
    proxyOptions.route = '/IOT';

    browserSync.init(null, {
        open: true,
        //proxy: "http://localhost:5000",
        files: ["./**/*.*"],
        //browser: "google chrome",
        port: 7000,
        server: {
            baseDir: "./",
            middleware: [proxy(proxyOptions)]
        }
    });

    // browserSync({
    //     open: true,
    //     port: 7000,
    //     server: {
    //         baseDir: "./websrc",
    //         middleware: [proxy(proxyOptions)]
    //     }
    // });

});

