var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Keycloak = require('keycloak-connect');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());

app.use(cors());

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

var keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

app.get('/service/public', function (req, res) {
  res.json({message: 'I am an unauthenticated response.'});
});

app.get('/service/secured', keycloak.protect(), function (req, res) {
  res.json({message: 'I am an authenticated response.'});
});

app.use('*', function (req, res) {
  res.send('Not found!');
});

app.listen(3000, function () {
  console.log('Started at port 3000');
});
