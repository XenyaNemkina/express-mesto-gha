const User = require('../models/users');


const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send({users})
  })
  .catch((e) => {
    res.status(500).send({ message: 'Something is wrong' })
  })
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail(() => {
    throw new Error('Not found')
  })
  .then((user) => {

    res.send({ data: user })
  })
  .catch((e) => {
    if(e.message == 'Not found') {
      res.status(404).send({ message: 'User not found' })
    }
    else {
      res.status(500).send({ message: 'Something is wrong' })
    }
  })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then((user) => {

    res.status(200).send(user);
  })
  .catch(e => {
    if( e.name == 'ValidationError') {
      const message = Object.values(e.errors)
      .map((error) => error.message)
      .join("; ");
      res.status(400).send({ message })
    } else {
      res.status(500).send({ message: 'Something is wrong' })
    }
  })
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(e => {
    if( e.name == 'ValidationError') {
      const message = Object.values(e.errors)
      .map((error) => error.message)
      .join("; ");
      res.status(400).send({ message })
    } else {
      res.status(500).send({ message: 'Something is wrong' })
    }
  })
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(e => {
    if( e.name == 'ValidationError') {
      const message = Object.values(e.errors)
      .map((error) => error.message)
      .join("; ");
      res.status(400).send({ message })
    } else {
      res.status(500).send({ message: 'Something is wrong' })
    }
  })
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };
