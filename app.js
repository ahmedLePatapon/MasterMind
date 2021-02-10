const Express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = Express();

const baseRouter = require('./routes');

app.use('/src_static', Express.static(__dirname + '/src' ));

app.use(cookieParser());

app.use(session({
    secret:'123456789SECRET',
    saveUninitialized : false,
    resave: false
}));

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', baseRouter);

module.exports = app;