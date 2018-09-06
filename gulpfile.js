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

const options = {
    src: 'src/',
    dist: 'dist/'
};

gulp.task('html', function() {
    return gulp.src(options.src + '*.html')
            .pipe(useref())
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', nano()))
            .pipe(gulp.dest(options.dist));
});

gulp.task('concatScripts', function() {
    return gulp.src(options.src + 'js/**/*.js')
            .pipe(maps.init())
            .pipe(concat('global.js'))
            .pipe(maps.write('./'))
            .pipe(gulp.dest(options.src + 'js'))
});

gulp.task('minifyScripts', function() {
    return gulp.src(options.src + 'js/global.js')
            .pipe(uglify())
            .pipe(rename('all.min.js'))
            .pipe(gulp.dest(options.dist + 'scripts'))
});

gulp.task('compileSass', function() {
    return gulp.src(options.src + 'sass/global.scss')
            .pipe(maps.init())
            .pipe(sass())
            .pipe(maps.write('./'))
            .pipe(gulp.dest(options.src + 'css'));
});

gulp.task('minifyStyles', function() {
    return gulp.src(options.src + 'css/global.css')
            .pipe(nano())
            .pipe(rename('all.min.css'))
            .pipe(gulp.dest(options.dist + 'styles'))
});

gulp.task('images', function() {
    return gulp.src(options.src + 'images/**/*.+(png|jpg)')
            .pipe(min())
            .pipe(gulp.dest(options.dist + 'content'));
});

gulp.task('clean', function() {
    return del([
        options.dist,
        options.src + 'js/global.js*',
        options.src + 'css'
    ]);
});

gulp.task('styles', gulp.series(
    'compileSass', 'minifyStyles'
));

gulp.task('scripts', gulp.series(
    'concatScripts', 'minifyScripts'
));

gulp.task('all', gulp.parallel(
    'styles', 'scripts', 'images'
));

gulp.task('build', gulp.series(
    'clean', 'all'
));



