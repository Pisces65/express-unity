const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Player = require('./modules/playerData');
const ejs = require('ejs');

const app = express();

const DBURI = 'mongodb://localhost:27017/local?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=testMongoDB&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true';

mongoose.connect(DBURI, { useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => {
        app.listen(4000);
        console.log('connected to testDB!!!');
        console.log('function opens at http://127.0.0.1:4000/') })
    .catch((err) => { console.log(err) });

//middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//show all players
app.get('/', (req, res) => {
    Player.find().sort({ createdAt: -1 })
      .then((result) => {
        const players = result;
        console.log(req.body);
        res.send(players);
      })
      .catch((err) => {
          console.log(err);
      })
});

//add a player
app.get('/player/add', (req, res) => {
    res.render('addplayer')
});

app.post('/player/add', (req, res) => {
    const player = new Player(req.body);
    //console.log(player);
    player.save()
      .then((result) => {
          console.log(result);
          res.redirect('/');
      })
      .catch((err) => {
          console.log(err);
      })
});

//update a player
app.get('/player/update', (req, res) => {
    res.render('updateplayer')
});

app.post('/player/update', (req, res) => {
    const player = new Player(req.body);
    //console.log(player);
    Player.findOneAndUpdate({name: player.name}, {
        transform_x: player.transform_x,
        transform_y: player.transform_y,
        transform_z: player.transform_z,
    })
      .then((result) => {
          console.log(result);
          res.redirect('/')
      })
      .catch((err) => {
          console.log();
      })
});

app.get('/player/:name', (req, res) => {
    const player_name = req.params.name;
    Player.findOne({name: player_name})
      .then((result) => {
          res.send(result);
      })
      .catch((err) => {
          console.log(err);
      })
});

//此处修改为delete方法
app.get('/player/delete/:name', (req, res) => {
    const player_name = req.params.name;
    Player.findOneAndDelete({name: player_name})
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
          console.log(err);
      })
});