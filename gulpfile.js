const gulp          = require('gulp');
const uglify        = require('gulp-uglify');
const useref        = require('gulp-useref');
const gulpif        = require('gulp-if');
const sass          = require('gulp-sass');
const nano          = require('gulp-cssnano');
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

gulp.task('compileSass', function() {
    return gulp.src(options.src + 'sass/global.scss')
            .pipe(sass())
            .pipe(gulp.dest(options.src + 'css'));
});

gulp.task('styles', gulp.series('compileSass', 'html'));

gulp.task('scripts', gulp.series('html'));

gulp.task('clean', function() {
    return del(options.dist);
});

