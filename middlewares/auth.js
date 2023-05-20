const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnautorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }
  req.user = payload;
  return next();
};
