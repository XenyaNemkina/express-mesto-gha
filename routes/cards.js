const express = require('express');
const { validateCard, validateCardById } = require('../validators/cardValidator');

const cardRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', validateCard, createCard);

cardRouter.delete('/:cardId', validateCardById, deleteCard);

cardRouter.put('/:cardId/likes', validateCardById, likeCard);

cardRouter.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = cardRouter;
