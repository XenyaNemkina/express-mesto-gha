const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/index');
const errors = require('./middlewares/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Присоединился к БД');
  });

app.use(express.json());
app.use('/', router);
app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
