const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => /^(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im.test(url),
      message: 'Поле "avatar" должно быть валидным url-адресом.',
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (url) => validator.isEmail(url),
      message: 'Неправильный формат email',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
