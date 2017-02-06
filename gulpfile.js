//require - це включення модуля який ми встановили через npm install (npm i)
var gulp = require('gulp'), //Підключаємо Gulp (npm i gulp --save-dev)
   sass = require('gulp-sass'),//Підключаємо SASS пакет 
   pug = require('gulp-pug'),//Підключаємо пакет pug 
   browserSync = require('browser-sync'), // Підключаємо Browser Sync
   concat = require('gulp-concat'), //Підключаємо gulp-concat (для конкатинації файлів)
   uglify = require('gulp-uglifyjs'), //Підключаємо gulp-uglifyjs (для стискання JS) 
   cssnano = require('gulp-cssnano'), //Підключаємо пакет для мінімізації CSS
   rename = require('gulp-rename'), //Підключаємо бібліотеку для перейменування файлів
   del = require('del'), //Підключаємо бібліотеку для видалення файлів і папок
   imagemin = require('gulp-imagemin'), //Підключаємо бібліотеку для роботи з зображеннями
   pngquant = require('imagemin-pngquant'), //Підключаємо бібліотеку  для роботи з png
   cache = require('gulp-cache'), //Підключаємо бібліотеку кешування
   autoprefixer = require('gulp-autoprefixer') //Підключаємо бібліотеку для авоматичного додавання префіксів
//---Створюємо таск sass---
gulp.task('sass', function () {
   return gulp.src('app/sass/**/*.sass') //Беремо файл
      .pipe(sass()) //Перекомпільовуємо SASS в CSS за допомогою gulp-sass
      .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true})) //Створюємо префікси
      .pipe(gulp.dest('app/css')) //Вивантажуємо результат в папку app/css
      .pipe(browserSync.reload({stream: true})) //Обновляємо CSS на сторінці при зміні
});
gulp.task('css', function () {
   return gulp.src('app/css/**/*.css') //Беремо файл
      .pipe(gulp.dest('dist/css')) //Вивантажуємо результат в папку app/css
      .pipe(browserSync.reload({stream: true})) //Обновляємо CSS на сторінці при зміні
});
gulp.task('pug', function () {
   return gulp.src('app/pug/**/*.pug') //Беремо файл
      .pipe(pug({
      pretty: true
   })) //Перекомпільовуємо pug в html за допомогою gulp-pug
//     
      .pipe(gulp.dest('app/')) //Вивантажуємо результат в папку app/css
      .pipe(browserSync.reload({stream: true})) //Обновляємо CSS на сторінці при зміні
});

gulp.task('fonts', function () {
   return gulp.src('app/**/*.{ttf,otf}')
      .pipe(gulp.dest('dist/'))
});
//---Створюємо таск browser-sync---
gulp.task('browser-sync', function () {
   browserSync({ //Виконуємо browser-sync
      server: { //задаємо параметри сервера
         baseDir: 'app' //Директорія для сервера - app
      }
      , notify: false  //Відключаємо сповіщення
   });
});
gulp.task('scripts', function () {
      return gulp.src([
      'app/libs/*' //беремо jQuery
//      ,'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' //беремо Magnific-Popup 
      ])
         .pipe(concat('libs.min.js')) //Збираємо в купу
         .pipe(uglify()) //Ститкаємо JS файл
         .pipe(gulp.dest('app/js')); //Вивантажуємо в папку app/js
   })
   //зжиматиме бібліотеки
gulp.task('css-libs', ['sass'], function () {
   return gulp.src('app/css/libs.css') //Вибираємо файл для мінімізації
      .pipe(cssnano()) //Стискаємо його
      .pipe(rename({suffix: '.min'})) //Додаємо суфіх .min
      .pipe(gulp.dest('app/css')); //Вивантажуємо в папку app/css
});
//WATCH
   //другий параметр -масив в якому вказуємо таски які потрібно виконати до запуску таска watch
gulp.task('watch', ['browser-sync','pug', 'css-libs', 'scripts'], function () {
   gulp.watch('app/sass/**/*.sass', ['sass']); //Спостереження за sass файлами в папці sass
   gulp.watch('app/*.html', browserSync.reload); //Спостереження за HTML файлами в корені проекта
   gulp.watch('app/js/**/*.js', browserSync.reload); //Спостереження за JS файлами в папці JS
})

gulp.task('clean', function () {
      return del.sync('dist')  //видалення папки dist перед зборкою
   })
  //оптимізація зображень
gulp.task('img', function () {
      return gulp.src('app/img/**/*') //Беремо всі зображення з app
         .pipe(cache(imagemin({ //Стискаємо їх з найкращими налаштуваннями з врахуванням кешування
         interlaced: true
         , progressive: true
         , svgoPlugins: [{
            removeViewBox: false
         }]
         , use: [pngquant()]
      }))).pipe(gulp.dest('dist/img')) //Вивантажуємо продакшн
   })
//---
gulp.task('build', ['clean', 'img','pug', 'sass', 'scripts','css','fonts'], function () {
   var buildCSS = gulp.src([ //Переносимо бібліотеки в продакшн 
      'app/css/main.css'
      , 'app/css/libs.min.css'

   ]).pipe(gulp.dest('dist/css'))
   var buildFonts = gulp.src('app/**/*.{ttf,otf}') //Переносимо шрифти в продакшн 
   .pipe(gulp.dest('dist'));
   var buildJS = gulp.src(['app/js/**/*']) //Переносимо скріпти в продакшн 
   .pipe(gulp.dest('dist/js'));
   var buildHTML = gulp.src('app/index.html') //Переносимо HTML в продакшн 
   .pipe(gulp.dest('dist'))
})
   //очитка кешу
gulp.task('clear', function () {
      return cache.clearAll();
   })

 
   
