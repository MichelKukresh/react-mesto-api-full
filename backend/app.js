const express = require('express');

// cors
const cors = require('cors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

// импортируем устанавливаем лимитер для исключения DoS атак npm i express-rate-limit
const rateLimit = require('express-rate-limit');

// использование helmet для простановки security-заголовков npm install --save helmet
const helmet = require('helmet');

const mongoose = require('mongoose');

// logger
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');

const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const auth = require('./middlewares/auth');
const { regexLink } = require('./util/utilConst');
const ErrorNotFound = require('./errors/ErrorNotFound');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

const app = express();

// настраиваем устанавливаем лимитер для исключения DoS атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors());

app.use(express.json());

// используем устанавливаем лимитер для исключения DoS атак
app.use(limiter);
app.use(helmet());

// // Массив доменов, с которых разрешены кросс-доменные запросы
// const allowedCors = [
//   'https://praktikum.tk',
//   'http://praktikum.tk',
//   'localhost:3000',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых
//   if (allowedCors.includes(origin)) {
//     // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

//   Значение для заголовка Access-Control-Allow-Methods по умолчанию(разрешены все типы запросов)
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   // сохраняем список заголовков исходного запроса
//   const requestHeaders = req.headers['access-control-request-headers'];

//   // Если это предварительный запрос, добавляем нужные заголовки
//   if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы любых типов (по умолчанию)
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     // разрешаем кросс-доменные запросы с этими заголовками
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // завершаем обработку запроса и возвращаем результат клиенту
//     return res.end();
//   }
//   return next();
// });

// !!важно до роутов
app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexLink),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/cards', routesCards); // запускаем

app.use('/users', routesUsers);

// !!вадно до обработчика ошибок, но после маршрутов
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Неправильный путь'));
});

// централизованный обработчик ошибок
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
