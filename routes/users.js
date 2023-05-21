const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/constants');

const userRouter = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUser,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(regEx),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
