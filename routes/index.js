const http2 = require('http2');
const router = require('express').Router();

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
  next();
});

module.exports = router;
