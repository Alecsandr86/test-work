var gulp = require('gulp');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var browserSync = require("browser-sync");
var reload = browserSync.reload;


var path = {
    build: {
        html     : 'build/',
        js       : 'build/js/',
        css      : 'build/css/',
        img      : 'build/images/',
        fonts    : 'build/fonts/',
        bower_js :'src/js/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.*',
        style: 'src/style/style.scss',
        img: 'src/images/*.*',
        fonts: 'src/fonts/**/*.*'

    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/script.js',
        style: 'src/style/**/*.scss',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
     //tunnel: true,
     host: 'localhost',
     port: 9000,
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('bower', function(){
  // jquery
  gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(gulp.dest(path.build.bower_js));

  // slick
    gulp.src('./bower_components/slick-carousel/slick/**/*.*')
        .pipe(gulp.dest("src/js/slick/"));
});


gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src('./src/style/*.css')
        .pipe(gulp.dest(path.build.css));

    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            //outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('minify:css', function () {
    gulp.src('build/css/*.css')
        .pipe(minify({keepBreaks: true}))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css/'))
    ;
});



gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
        //.pipe(reload({stream: true}));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('./src/images/sprite/*.*').pipe(spritesmith({
        algorithm: "top-down",
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        algorithmOpts: {sort: false},
        padding: 5,
        imgPath: '../images/sprite.png',
        cssOpts: {
            cssClass: function (item) {
                // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                if (item.name.indexOf('-hover') !== -1) {
                    return '.sprite-' + item.name.replace('-hover', ':hover');
                    // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                } else {
                    return '.sprite-' + item.name;
                }
            }
        }
    }));
    spriteData.img.pipe(gulp.dest('./src/images/'));
    spriteData.css.pipe(gulp.dest('./src/style/partials/'));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'bower',
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',

]);


gulp.task('watch', function(){
    watch('src/**/*.html', function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('bower'),
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
