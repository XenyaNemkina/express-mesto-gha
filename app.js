const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const validationErrors = require('celebrate').errors;
const router = require('./routes/index');
const errors = require('./middlewares/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Присоединился к БД');
  });

app.use(express.json());
app.use(cookieParser());
app.use('/', router);
app.use(validationErrors());
app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
