const http2 = require('http2');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
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
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (card.owner._id.toString() !== req.user.id.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .populate('owner')
        .then((cardToDelete) => res.send({ data: cardToDelete }));
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
        return next(new NotFoundError('Карточка не найдена.'));
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
