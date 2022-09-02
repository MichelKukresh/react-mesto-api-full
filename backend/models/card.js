const mongoose = require('mongoose');
const validator = require('validator'); // npm i validator
// const { default: isURL } = require('validator/lib/isurl');

const cardsSchema = new mongoose.Schema({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

  link: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Invalid Url');
      }
    }, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  owner: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: Schema.Types.ObjectId,  // тип ObjectId
    ref: 'User',
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  likes: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: Schema.Types.ObjectId,  // тип ObjectId
    ref: 'User',
    default: [],
  },
  createdAt: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Card', cardsSchema);
