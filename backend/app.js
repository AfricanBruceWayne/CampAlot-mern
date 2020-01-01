const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./db');

const users = require('./routes/user');

// Mongoose config
mongoose.connect(config.DB, { useNewUrlParser: true })
    .then(() => {
        console.log('Database is connected')
    }, err => {
        console.log('Can not connect to database: ' + err)
    });

const app = express();

app.use(passport.initialize());
require('./passport')(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/users', users);

app.get('/', (req, res) => {
    res.send('hello');
});

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
