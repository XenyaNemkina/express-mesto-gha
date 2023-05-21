const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { validatorCreateUser } = require('../validators/userValidator');

router.post('/', validatorCreateUser, createUser);

module.exports = router;
