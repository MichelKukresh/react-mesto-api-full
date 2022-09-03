const Card = require('../models/card');

const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorAuthorizedButForbidden = require('../errors/ErrorAuthorizedButForbidden');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = { _id: req.user._id };
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.allCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

// удаление карточки
module.exports.idCards = (req, res, next) => {
  // определение создаткля карточки
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий _id карточки.');
      }
      if (card.owner !== req.user._id) { /// card.owner._id
        throw new ErrorAuthorizedButForbidden('Удаление карточки чужого пользователя запрещено.');
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.id)
        .orFail(new ErrorNotFound('Передан несуществующий _id карточки.'))
        .then((card) => res.send({ data: card }));
    })
    .catch((err) => next(err));
};

module.exports.likesCardPut = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new ErrorNotFound('Передан несуществующий _id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.likesCardDelete = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new ErrorNotFound('Передан несуществующий _id карточки.'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
