/* 
   _____                    _    _____       _                 .        . |
  / ____|                  | |  / ____|     | |               ;W       ;W |
 | (___   ___  ___ _ __ ___| |_| (___   __ _| | ___          f#E      f#E |
  \___ \ / _ \/ __| '__/ _ \ __|\___ \ / _` | |/ _ \       .E#f     .E#f  |
  ____) |  __/ (__| | |  __/ |_ ____) | (_| | |  __/      iWW;     iWW;   |
 |_____/ \___|\___|_|  \___|\__|_____/ \__,_|_|\___|     L##Lffi  L##Lffi \
                                     By BestTeamEver    tLLG##L  tLLG##L  |
                                                          ,W#i     ,W#i   | 
                                                         j#E.     j#E.    | 
                                                       .D#j     .D#j      | 
                                                      ,WK,     ,WK,       |  
                                                      EG.      EG.        | 
                                                      ,        ,          |
  
*/
console.log("   _____                    _    _____       _                 .        . \n  / ____|                  | |  / ____|     | |               ;W       ;W \n | (___   ___  ___ _ __ ___| |_| (___   __ _| | ___          f#E      f#E \n  \\___ \\ / _ \\/ __| '__/ _ \\ __|\\___ \\ / _` | |/ _ \\       .E#f     .E#f  \n  ____) |  __/ (__| | |  __/ |_ ____) | (_| | |  __/      iWW;     iWW;   \n |_____/ \\___|\\___|_|  \\___|\\__|_____/ \\__,_|_|\\___|     L##Lffi  L##Lffi \n                                     By BestTeamEver    tLLG##L  tLLG##L  \n                                                          ,W#i     ,W#i   \n                                                         j#E.     j#E.    \n                                                       .D#j     .D#j      \n                                                      ,WK,     ,WK,       \n                                                      EG.      EG.        \n                                                      ,        ,          \n\n\n");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var objetos = require('./routes/Objetos');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//fucking CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/objetos', objetos);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

mongoose.connect("mongodb://localhost/SecretSale", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});

module.exports = app;