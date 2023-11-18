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

app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));
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
  let userId = req.params._id;

  User.findOne({ _id: userId })
    .then((user) => {
      let date =
        new Date(req.body.date) !== 'Invalid Date' && req.body.date
          ? new Date(req.body.date)
          : new Date();
      // let options = {
      //   weekday: 'short',
      //   year: 'numeric',
      //   month: 'short',
      //   day: 'numeric',
      // }; // specify the format options
      // let formattedDate = date.toLocaleDateString('en-US', options); // get the formatted date string
      let newExercise = new Exercise({
        username: user.username,
        description: req.body.description,
        duration: req.body.duration,
        date: date,
      });

      newExercise
        .save()
        .then((exercise) => {
          let response = {
            _id: user._id,
            username: exercise.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
          };
          res.send(response);
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
//  optional query params /logs?from=2011-03-23&to=2011-03-26&limit=2
app.get('/api/users/:_id/logs', (req, res) => {
  let userId = req.params._id;
  let queryDate;
  if (req.query.from && req.query.to) {
    // yyyy-mm-dd
    let startDate = new Date(req.query.from);
    let endDate = new Date(req.query.to);
    queryDate = { date: { $gte: startDate, $lte: endDate } };
  }

  User.findOne({ _id: userId }).then((user) => {
    let query = Object.assign({ username: user.username }, queryDate);
    Exercise.find(query)
      .limit(req.query.limit || null)
      .select('description duration date -_id')
      .then((result) => {
        console.log(JSON.parse(JSON.stringify(result)));
        let parsedResult = JSON.parse(JSON.stringify(result));
        parsedResult.forEach((exercise) => {
          let date = new Date(exercise.date);
          exercise.date = date.toDateString();
        });
        let response = {
          username: user.username,
          _id: user._id,
          count: result.length,
          log: parsedResult,
        };

        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

//  Export the Express API
module.exports = app;
