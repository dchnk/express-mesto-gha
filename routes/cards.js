const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.put('/:_id/likes', likeCard);

router.delete('/:_id/likes', dislikeCard);

router.delete('/:_id', deleteCard);

router.post('/', createCard);

module.exports = router;
