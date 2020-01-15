"use strict";
const compression = require('compression')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config/db-conf');
const admin=require('./controle/adminControle');
const ads=require('./controle/adsControle');
const categorie= require('./controle/categorieControle');
const command= require('./controle/commandControle');
const general= require('./controle/generalControle');
const notification= require('./controle/notificationControle');
const pass= require('./controle/passControle');
const precommand= require('./controle/precommandControle');
const product= require('./controle/productControle');
const promotion= require('./controle/promotionControle');
const user= require('./controle/userControle');
app.use(compression())
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/user', user);
app.use('/ads', ads);
app.use('/categorie', categorie);
app.use('/command',command );
app.use('/general',general );
app.use('/notification',notification );
app.use('/pass',pass );
app.use('/precommand',precommand );
app.use('/product',product );
app.use('/promotion',promotion );
app.use('/admin',admin);
app.use('/uploads/', express.static(path.join(__dirname, './uploads')));


    mongoose.Promise = global.Promise;
    mongoose.connect(config.DB, { useNewUrlParser: true }).then(
      () => {console.log('Database is connected') },
      err => { console.log('Can not connect to the database'+ err)}
    );
 
    const port = process.env.PORT || 3000;
    app.set('port', port);
    const server = http.createServer(app);
    // Loading socket.io
    var io = require('socket.io').listen(server);
    app.io = io;
    
    // When a client connects, we note it in the console
    io.sockets.on('connection', function (socket) {
        console.log('A client is connected!');
    });
    server.listen(port, function(){
     console.log('Listening on port ' + port);
    });
