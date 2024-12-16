var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware

// Import routes
var usersRouter = require('./routes/users');
var studentsRouter = require('./routes/admin'); // Remove if unused
const dataRouter = require('./routes/data'); // Data route for handling Photon data

var app = express();

// Generate a random API Key for Photon
const API_KEY = "vnoa62an4gp4i3bs8eszdx";//Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(`Generated API Key: ${API_KEY}`);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Enable cross-origin access
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Middleware
app.use(logger('dev'));
app.use(cors()); // Enable CORS globally
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/users', usersRouter);
app.use('/students', studentsRouter); // Remove if unnecessary
app.use('/data', dataRouter); // Use the dedicated data route

// Additional routes for the project
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/createaccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createaccount.html'));
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
