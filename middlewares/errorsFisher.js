module.exports.errorsFisher = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Что-то не так с переданными данными' });
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка APP.JS' : message,
  });
  next();
};
