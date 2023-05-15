const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const User = require('../models/users');

const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_NOT_FOUND, // 404
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя нет' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res.send({ message: 'Все верно!' });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, sameSite: true, maxAge: 3600000 * 24 * 7 });
      res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
