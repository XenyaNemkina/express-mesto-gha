const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const signin = require('./signin');
const signup = require('./signup');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/signin', signin);
router.use('/signup', signup);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
