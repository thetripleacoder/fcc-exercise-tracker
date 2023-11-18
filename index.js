const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch((err) => {
    console.error('Error connecting to Mongo', err);
  });

//  User Schema, Model
const userSchema = new mongoose.Schema({
  username: String,
});
let User = mongoose.model('User', userSchema);

//  Exercise Schema, Model
const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});
let Exercise = mongoose.model('Exercise', exerciseSchema);

//  Log Schema, Model
const logSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date,
});
let Log = mongoose.model('Log', logSchema);

app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create and Save user
app.post('/api/users', (req, res) => {
  let newUser = new User({
    username: req.body.username,
  });

  newUser
    .save()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Get all users
app.get('/api/users', (req, res) => {
  User.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Create exercise to a User
app.post('/api/users/:_id/exercises', (req, res) => {
  let userId = req.params.id;

  User.findOne({ _id: userId })
    .then((user) => {
      let newDate =
        new Date(req.body.date) !== 'Invalid Date' && req.body.date
          ? new Date(req.body.date)
          : new Date();
      let newExercise = new Exercise({
        username: user.username,
        description: req.body.description,
        duration: req.body.duration,
        date: newDate,
      });
      console.log(req.body, new Date(req.body.date));

      newExercise
        .save()
        .then((exercise) => {
          res.send(exercise);
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

//  Get User logs
app.get('/api/users/:_id/logs', (req, res) => {
  let userId = req.params.id;
  User.findOne({ _id: userId }).then((user) => {
    Exercise.find({ _id: req.params.id })
      .then((result) => {
        res.send({ message: 'List of user orders', data: result });
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
