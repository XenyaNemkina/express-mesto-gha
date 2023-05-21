const express = require('express');
const { validateUser, validateUserMe, validateAvatar } = require('../validators/userValidator');

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

userRouter.get('/:userId', validateUser, getUser);

userRouter.patch('/me', validateUserMe, updateUser);

userRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = userRouter;
