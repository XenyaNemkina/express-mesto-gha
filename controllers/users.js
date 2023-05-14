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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя нет' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((e) => {
      if (e instanceof CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный ID' });
      }
      if (e instanceof DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя нет' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e instanceof ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
      }
    });
};

const createUser = (req, res) => {
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
    .catch((e) => {
      if (e instanceof ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((e) => {
      if (e instanceof ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((e) => {
      if (e instanceof ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Something is wrong' });
      }
    });
};

const login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
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
