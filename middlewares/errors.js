const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const http2 = require('http2');

const {
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_NOT_FOUND, // 404
  HTTP_STATUS_CONFLICT, // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;

module.exports = ((e, req, res, next) => {
  if (e instanceof ValidationError) {
    const message = Object.values(e.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
  }
  if (e instanceof CastError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный ID' });
  }
  if (e instanceof DocumentNotFoundError) {
    return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточки не существует' });
  }
  if (e.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь уже существует' });
  }
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
  return next();
});
