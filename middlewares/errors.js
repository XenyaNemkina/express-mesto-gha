const {
  CastError,
  ValidationError,
} = require('mongoose').Error;
const http2 = require('http2');

const UnauthorizedError = require('../errors/UnautorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_CONFLICT, // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;

module.exports = ((e, req, res, next) => {
  if (e.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с такой почтой уже существует' });
  }
  if (e instanceof NotFoundError
    || e instanceof UnauthorizedError
    || e instanceof ForbiddenError) {
    return res.status(e.statusCode).send({ message: e.message });
  }
  if (e instanceof CastError || e instanceof ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
  }
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  return next();
});
