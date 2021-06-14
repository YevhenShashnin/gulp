const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')
const del = require('del')
const include = require('gulp-file-include')
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const rename = require('gulp-rename')
const uglify = require('gulp-uglify-es').default
const gcmq = require('gulp-group-css-media-queries')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const webpHTML = require('gulp-webp-html')
//webp for css
//svgSprite for svg


function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(webpHTML())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist/css'))
}

function  js() {
  return src('src/js/**.js')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(dest('dist/js'))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest('dist/js'))
}

function images() {
  return src('src/img/**/**.{jpg,png,svg,gif,ico,webp}')
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest('dist/img'))
    .pipe(src('src/img/**/**.{jpg,png,svg,gif,ico,webp}'))
    .pipe( 
      imagemin({
        //many others
        optimizationLevel: 5
      })
    )
    .pipe(dest('dist/img'))
}

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist'
  })
  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/js/**.js', series(js)).on('change', sync.reload)
} 

exports.build = series(clear, scss, html, js, images)
exports.serve = series(clear, scss, html, js, images, serve)
exports.clear = clear