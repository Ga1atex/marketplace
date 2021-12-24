//import replace from 'gulp-replace'; //.pipe(replace('bar', 'foo'))
import gulp from 'gulp';
const { src, dest } = gulp;
import fileSystem from 'fs';
import htmlmin from 'gulp-htmlmin';
import browsersync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import groupMedia from 'gulp-group-css-media-queries';
import plumber from 'gulp-plumber';
import del from 'del';
import imagemin from 'gulp-imagemin';
import uglify from 'gulp-uglify-es';
import rename from 'gulp-rename';
import fileinclude from 'gulp-file-include';
import cleanCss from 'gulp-clean-css';
import newer from 'gulp-newer';

import webp from 'imagemin-webp';
import webpcss from 'gulp-webpcss';
import webphtml from 'gulp-webp-html';

import fonter from 'gulp-fonter';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';

import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectName = basename(__dirname);

const srcFolder = "src";

// const env = process.env.NODE_ENV || 'development';
// const production = env === 'production';

const path = {
	build: {
		html: projectName + "/",
		js: projectName + "/js/",
		css: projectName + "/css/",
		images: projectName + "/img/",
		fonts: projectName + "/fonts/",
		json: projectName + "/json/"
	},
	src: {
		favicon: srcFolder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
		html: [srcFolder + "/*.html", "!" + srcFolder + "/_*.html"],
		js: [srcFolder + "/js/app.js", srcFolder + "/js/vendors.js"],
		css: srcFolder + "/scss/style.scss",
		images: [srcFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		fonts: srcFolder + "/fonts/*.ttf",
		json: srcFolder + "/json/*.json"
	},
	watch: {
		html: srcFolder + "/**/*.html",
		js: srcFolder + "/**/*.js",
		css: srcFolder + "/scss/**/*.scss",
		images: srcFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		json: srcFolder + "/json/*.json"
	},
	clean: "./" + projectName + "/"
};

const handleError = (err) => {
	console.log("\x1b[31m", `${err.name} in plugin "${err.plugin}"`, err._messageWithDetails());
	this.emit('end');
};

const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: "./" + projectName + "/"
		},
		notify: false,
		port: 8082,
	});
};

export const json = () => {
	return src(path.src.json)
		.pipe(plumber())
		.pipe(dest(path.build.json));
};

export const html = () => {
	return src(path.src.html, {})
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
};

export const css = () => {
	// return src(path.src.css, {sourcemaps: true})
	return src(path.src.css, {})
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(
			scss({
				outputStyle: "expanded"
			}).on('error', scss.logError)
		)
		.pipe(sourcemaps.write({ includeContent: false }))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(groupMedia())
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
		// .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
		.pipe(cleanCss({ level: 2 }))
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(sourcemaps.write('../sourcemaps'))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
};

export const js = () => {
	return src(path.src.js, {})
		.pipe(plumber({
			errorHandler: handleError
		}))
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify.default(/* options */))
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
};

export const images = () => {
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
};

export const favicon = () => {
	return src(path.src.favicon)
		.pipe(plumber())
		.pipe(
			rename({
				extname: ".ico"
			})
		)
		.pipe(dest(path.build.html));
};

export const fonts_otf = () => {
	return src('./' + srcFolder + '/fonts/*.otf')
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulp.dest('./' + srcFolder + +'/fonts/'));
};

export const fonts = () => {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
};

export const fontstyle = () => {
	let file_content = fileSystem.readFileSync(srcFolder + '/scss/fonts.scss');
	if (file_content == '') {
		fileSystem.writeFile(srcFolder + '/scss/fonts.scss', '', cb);
		return fileSystem.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fileSystem.appendFile(srcFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
};

export const cb = () => { };

export const clean = () => {
	return del(path.clean);
};

export const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.json], json);
};

const build = gulp.series(clean, fonts_otf, gulp.parallel(html, css, js, json, favicon, images), fonts, gulp.parallel(fontstyle));
export default gulp.parallel(build, watchFiles, browserSync);
