const gulp          = require('gulp');
const uglify        = require('gulp-uglify');
const useref        = require('gulp-useref');
const gulpif        = require('gulp-if');
const sass          = require('gulp-sass');
const nano          = require('gulp-cssnano');
const maps          = require('gulp-sourcemaps');
const concat        = require('gulp-concat');
const rename        = require('gulp-rename');
const min           = require('gulp-imagemin');
const del           = require('del');
const browserSync   = require('browser-sync').create();

const options = {
    src: 'src/',
    dist: 'dist/'
};

/* General Tasks
*****************/

// start web server
gulp.task('ws', function() {
    browserSync.init({
        server: {
            baseDir: options.src
        }
    });
});

//concat all JS files
gulp.task('concatScripts', function() {
    return gulp.src([
                options.src + 'js/jquery-3.3.1.min.js', 
                options.src + 'js/circle/*.js' ])
            .pipe(maps.init())
            .pipe(concat('global.js'))
            .pipe(maps.write('./'))
            .pipe(gulp.dest(options.src + 'js'))
            .pipe(browserSync.stream());
});

// sass to css
gulp.task('compileSass', function() {
    return gulp.src(options.src + 'sass/global.scss')
            .pipe(maps.init())
            .pipe(sass())
            .pipe(maps.write('./'))
            .pipe(gulp.dest(options.src + 'css'))
            .pipe(browserSync.stream());
});

// minify and move images into dist (content dir)
gulp.task('images', function() {
    return gulp.src(options.src + 'images/**/*.+(png|jpg)')
            .pipe(min())
            .pipe(gulp.dest(options.dist + 'content'));
});

// move icons into dist
gulp.task('icons', function() {
    return gulp.src(options.src + 'icons/**/*.+(svg|eot|ttf|woff)')
            .pipe(gulp.dest(options.dist + 'icons'));
});

// cleans all generated files
gulp.task('clean', function() {
    return del([
        options.dist,
        options.src + 'js/global.js*',
        options.src + 'css'
    ]);
});


/* Treehouse Project Tasks
**************************/

gulp.task('minifyScripts', function() {
    return gulp.src(options.src + 'js/global.js')
            .pipe(uglify())
            .pipe(rename('all.min.js'))
            .pipe(gulp.dest(options.dist + 'scripts'))
});

gulp.task('minifyStyles', function() {
    return gulp.src(options.src + 'css/global.css')
            .pipe(nano())
            .pipe(rename('all.min.css'))
            .pipe(gulp.dest(options.dist + 'styles'))
});

gulp.task('styles', gulp.series(
    'compileSass', 'minifyStyles'
));

gulp.task('scripts', gulp.series(
    'concatScripts', 'minifyScripts'
));


// Watch Tasks

// watch sass files
gulp.task('watch:styles', function() {
    gulp.watch(options.src + 'sass/**/*.scss', gulp.series('compileSass'));
});

// watch JS files
gulp.task('watch:scripts', function() {
    gulp.watch(['!' + options.src + 'js/global.js*', options.src + 'js/**/*.js'], gulp.series('concatScripts'));
});

// watch html files
gulp.task('watch:html', function() {
    gulp.watch(options.src + '*.html').on('change', browserSync.reload);
});

// trigger web server and watch tasks
gulp.task('watch', gulp.parallel(
    'ws', 'watch:styles', 'watch:html', 'watch:scripts'
));


// Build Tasks

gulp.task('all', gulp.parallel(
    'styles', 'scripts', 'images', 'icons'
));

gulp.task('build', gulp.series(
    'clean', 'all'
));

gulp.task('default', gulp.series(
    'build', 'watch'
));



/* Build Prod Ready Dist Tasks
*******************************/

// minify and move images into dist (images dir)
gulp.task('images:prod', function() {
    return gulp.src(options.src + 'images/**/*.+(png|jpg)')
            .pipe(min())
            .pipe(gulp.dest(options.dist + 'images'));
});

gulp.task('html', function() {
    return gulp.src(options.src + '*.html')
            .pipe(useref())
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', nano()))
            .pipe(gulp.dest(options.dist));
});

gulp.task('all:prod', gulp.parallel(
    'compileSass', 'concatScripts', 'images:prod', 'icons'
));

gulp.task('build:prod', gulp.series(
    'clean', 'all:prod', 'html'
));





