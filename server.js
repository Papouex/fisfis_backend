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
const client = require ('./controle/clientControle');
const user = require ('./controle/userControle');
const job = require ('./controle/jobControle');
const profile = require('./controle/profileControle');
const image = require('./controle/fileControle');
const notification = require('./controle/notificationControle')

app.use(compression())
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/client', client);
app.use('/user', user);
app.use('/job',job);
app.use('/profile',profile);
app.use('/notification', notification);
app.use('/image',image)
app.use('/uploads/', express.static(path.join(__dirname, './uploads')));

//app.use('/job',job);

    mongoose.Promise = global.Promise;
    mongoose.connect(config.DB, { useNewUrlParser: true }).then(
      () => {console.log('Database is connected') },
      err => { console.log('Can not connect to the database'+ err)}
    );
    const allowedExt = [
        '.js',
        '.ico',
        '.css',
        '.png',
        '.jpg',
        '.woff2',
        '.woff',
        '.ttf',
        '.svg',
      ];
 
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
 // Send all other requests to the Angular app
 /*app.get('/', (req, res) => {
    res.send(path.join(__dirname, '/dist/jobi/index.html'));
    
});*/
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
