const http2 = require('http2');
const router = require('express').Router();
const auth = require('../middlewares/auth');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

const signin = require('./signin');
const signup = require('./signup');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signin', signin);
router.post('/signup', signup);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', auth, (req, res, next) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
  next();
});

module.exports = router;
