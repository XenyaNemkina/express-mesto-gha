const express = require('express');

const userRouter = express.Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUser);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
