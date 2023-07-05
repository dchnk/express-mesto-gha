/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const { checkToken } = require('./middlewares/auth');

const NotFoundError = require('./utils/Errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

const {
  login,
  createUser,
} = require('./controllers/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
}).then(() => {
  console.log('db is connected');
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use(checkToken);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  const err = new NotFoundError('Страница не найдена');
  next(err);
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка APP.JS' : message,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
