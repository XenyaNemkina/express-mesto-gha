const Card = require('../models/cards');
const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

const getCards = (req, res) => {
  Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => {
    res.send(cards)
  })
  .catch((e) => {
    res.status(500).send({ message: 'Something is wrong' })
  })
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
  .then((card) => card.populate('owner'))
  .then((card) => res.status(201).send(card))
  .catch((e) => {
    if (e instanceof ValidationError) {
      return res.status(400).send({
        message: `Переданы некорректные данные`,
      })}
    res.status(500).send({ message: 'Something is wrong' })
  })
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
  .orFail(() => {
    throw new Error('Card not found')
  })
  .then((card) => res.send(card))
  .catch((e) => {
    res.status(500).send({ message: 'Something is wrong' })
  })
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
.orFail(() => {
  throw new Error('Card not found')
})
.then((card) => res.status(200).send(card))
.catch((e) => {
  if (e instanceof DocumentNotFoundError) {
    return res.status(404).send({ message: 'Такой карточки нет' })
  } else if (e instanceof CastError) {
    return res.status(400).send({ message: `Передан некорректный ID` })}
  res.status(500).send({ message: 'Something is wrong' })
})
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
.orFail(() => {
  throw new Error('Card not found')
})
.then((card) => res.status(200).send(card))
.catch((e) => {
  if (e instanceof DocumentNotFoundError) {
    return res.status(404).send({ message: 'Такой карточки нет' })
  } else if (e instanceof CastError) {
    return res.status(400).send({ message: `Передан некорректный ID` })}
  res.status(500).send({ message: 'Something is wrong' })
})
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }