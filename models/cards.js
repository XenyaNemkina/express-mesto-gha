const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля 2 символа'],
      maxlength: [30, 'Максимальная длина поля 30 символов'],
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Неправильный формат ссылки на аватар',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле должно быть заполнено'],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: 'created_at' } },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
