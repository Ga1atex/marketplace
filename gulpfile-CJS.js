//let replace = require('gulp-replace'); //.pipe(replace('bar', 'foo'))
const { src, dest } = require('gulp');
const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass')(require('sass'));
const group_media = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const del = require('del');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const clean_css = require('gulp-clean-css');
const newer = require('gulp-newer');

const webp = require('imagemin-webp');
const webpcss = require('gulp-webpcss');
const webphtml = require('gulp-webp-html');

const fonter = require('gulp-fonter');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const project_name = require("path").basename(__dirname);
const src_folder = "src";

const path = {
  build: {
    html: project_name + "/",
    js: project_name + "/js/",
    css: project_name + "/css/",
    images: project_name + "/img/",
    fonts: project_name + "/fonts/",
    json: project_name + "/json/"
  },
  src: {
    favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
    html: [src_folder + "/*.html", "!" + src_folder + "/_*.html"],
    js: [src_folder + "/js/app.js", src_folder + "/js/vendors.js"],
    css: src_folder + "/scss/style.scss",
    images: [src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
    fonts: src_folder + "/fonts/*.ttf",
    json: src_folder + "/json/*.json"
  },
  watch: {
    html: src_folder + "/**/*.html",
    js: src_folder + "/**/*.js",
    css: src_folder + "/scss/**/*.scss",
    images: src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    json: src_folder + "/json/*.json"
  },
  clean: "./" + project_name + "/"
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./" + project_name + "/"
    },
    notify: false,
    port: 8082,
  });
}
function json() {
  return src(path.src.json)
    .pipe(plumber())
    .pipe(dest(path.build.json));
}
function html() {
  return src(path.src.html, {})
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css, {})
    .pipe(plumber())
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(webpcss(
      {
        webpClass: "._webp",
        noWebpClass: "._no-webp"
      }
    ))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function js() {
  return src(path.src.js, {})
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify(/* options */))
    .pipe(
      rename({
        suffix: ".min",
        extname: ".js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.images)
    .pipe(newer(path.build.images))
    .pipe(
      imagemin([
        webp({
          quality: 75
        })
      ])
    )
    .pipe(
      rename({
        extname: ".webp"
      })
    )
    .pipe(dest(path.build.images))
    .pipe(src(path.src.images))
    .pipe(newer(path.build.images))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(path.build.images));
}

function favicon() {
  return src(path.src.favicon)
    .pipe(plumber())
    .pipe(
      rename({
        extname: ".ico"
      })
    )
    .pipe(dest(path.build.html));
}

function fonts_otf() {
  return src('./' + src_folder + '/fonts/*.otf')
    .pipe(plumber())
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(gulp.dest('./' + src_folder + +'/fonts/'));
}

function fonts() {
  src(path.src.fonts)
    .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream());
}

function fontstyle() {
  let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(src_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() { }

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.json], json);
}

const build = gulp.series(clean, fonts_otf, gulp.parallel(html, css, js, json, favicon, images), fonts, gulp.parallel(fontstyle));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.json = json;
exports.favicon = favicon;
exports.fonts_otf = fonts_otf;
exports.fontstyle = fontstyle;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;