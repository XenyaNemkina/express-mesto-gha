const http2 = require('http2');
const { DocumentNotFoundError } = require('mongoose').Error;
const { ForbiddenError } = require('../errors/ForbiddenError');
const Card = require('../models/cards');

const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = http2.constants;

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        return next(new DocumentNotFoundError('Такой карточки нет'));
      }
      if (card.owner.valueOf() !== _id) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку!'));
      }
      return Card.findByIdAndRemove(cardId)
        .then((delCard) => res.status(HTTP_STATUS_OK).send(delCard))
        .catch(next);
    })
    .catch(next);
};

const cardLikesChange = (req, res, data, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    data,
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        return next(new DocumentNotFoundError('Такой карточки нет'));
      }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const data = { $addToSet: { likes: req.user._id } };
  cardLikesChange(req, res, data, next);
};

const dislikeCard = (req, res, next) => {
  const data = { $pull: { likes: req.user._id } };
  cardLikesChange(req, res, data, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
