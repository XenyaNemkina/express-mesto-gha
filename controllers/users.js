const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');
const User = require('../models/users');

const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = http2.constants;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

const findUser = (req, res, _id, next) => {
  User.findById(({ _id }))
    .orFail()
    .then((user) => {
      if (!user) {
        next(new NotFoundError({ message: 'Пользователь не найден' }));
      }
      res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const _id = req.params.userId;
  findUser(req, res, _id, next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  findUser(req, res, _id, next);
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
      res.status(HTTP_STATUS_CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch(next);
};

const updateData = (req, res, data, next) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const data = req.body;
  updateData(req, res, data, next);
};

const updateAvatar = (req, res, next) => {
  const data = req.body;
  updateData(req, res, data, next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.status(HTTP_STATUS_OK).send({ message: 'Аутентификация прошла успешно' });
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
