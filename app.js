const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
.then(() => {
  console.log('Присоединился к БД')
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '644ec9bb100d4578e0d63947'
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' })
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});