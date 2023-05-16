const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходимо авторизоваться1' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    return res
      .status(401)
      .send({ message: 'Необходимо авторизоваться2' });
  }
  req.user = payload;
  return next();
};
