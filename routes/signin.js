const router = require('express').Router();
const { login } = require('../controllers/users');
const { validatorLogin } = require('../validators/userValidator');

router.post('/', validatorLogin, login);

module.exports = router;
