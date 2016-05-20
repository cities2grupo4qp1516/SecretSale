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
var sockjs = require('sockjs');
var fs = require('fs');
var https = require('https');
var divisors = require('number-theory');

var options = {
    key: fs.readFileSync('secretsale.key'),
    cert: fs.readFileSync('secretsale.crt'),
    passphrase: 'makitos666'
};
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

//app.use('/', routes);
app.use('/users', users);
app.use('/objetos', objetos);

app.get('/', function (req, res) {
    res.send(connections2);
});


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

function rc4(key, str) {
    var s = [],
        j = 0,
        a, res = '';
    for (var i = 0; i <= 255; i++) {
        s[i] = i;
    }
    /*
        j=0;
        for i = 0 to 255
        {
           j = (j+S[i] + K[i]) mod 256;
           intercambia S[i] and S[j];
        }   
    */
    for (i = 0; i <= 255; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        a = s[i];
        s[i] = s[j];
        s[j] = a;
    }

    /*
    i = (i + 1) mod 256;
    j = (j + S[i]) mod 256;
    intercambia S[i] and S[j];
    t = (S[i] + S[j]) mod 256;
    Exponer valor de S[t];
    */
    i = 0;
    j = 0;
    for (var b = 0; b < str.length; b++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        a = s[i];
        s[i] = s[j];
        s[j] = a;
        res += String.fromCharCode(str.charCodeAt(b) ^ s[(s[i] + s[j]) % 256]);
        //res += (str.charCodeAt(b) ^ s[(s[i] + s[j]) % 256]).toString();
    }
    return res;
}
var connections = [];
var connections2 = [];
var clientes = [];
var usuariosConectados = 0;
var chat = sockjs.createServer();
/*var arrayFound = obj.ite  ms.filter(function(item) {
    return item.isRight == 1;
})*/
function searchUserByConn(conn) {

    var a = conn.id;
    var c = -1;
    console.log(connections.length);
    for (var i = 0; connections.length > i; i++) {
        if (connections[i] != null) {
            var b = connections[i].id;

            if (a == b) {
                c = i;
                console.log(c);
            }
        }
    }
    return connections2[c];
};

chat.on('connection', function (conn) {
    conn.on('data', function (message) {
        var data = JSON.parse(message);
        console.log(message);
        switch (data.tipo) {
        case 0:
            //vendor registration
            connections.push({
                nick: data.nombre,
                conn: conn
            });
            connections2.push(data.nombre);
            console.log(connections);

            break;
        case 23:
            connections.filter(function (item) {
                return item.nick == data.para;
            })[0].conn.write(JSON.stringify({
                Type: 24,
                mensaje: data.mensaje,
                de: data.de,
                para: data.para
            }));
            break;
        case 69:
            console.log(data);
            connections.push({
                nick: data.de,
                conn: conn
            });

            var caca = divisors.primitiveRoot(157457);

            connections.filter(function (item) {
                return item.nick == data.para;
            })[0].conn.write(JSON.stringify({
                Type: 90,
                cliente: data.de,
                g: caca,
                p: 157457
            }));

            connections.filter(function (item) {
                return item.nick == data.para;
            })[0].conn.write(JSON.stringify({
                Type: 12,
                cliente: data.de,
                g: caca,
                p: 157457
            }));

            connections.filter(function (item) {
                return item.nick == data.de;
            })[0].conn.write(JSON.stringify({
                Type: 12,
                cliente: data.de,
                g: caca,
                p: 157457
            }));

            //conn.write(JSON.stringify(MsjToA));
            break;
        case 1:
            //  TTP, B, M, PO
            /*  TTP → A : A, B, TR, L, PS
             3. TTP → B : A, L, PO*/

            var MsjToA = {
                A: searchUserByConn(conn),
                B: data.B,
                Tr: Date.now(),
                L: L,
                Ps: "Ps",
                Type: 1
            };

            var Ps = bignum.fromBuffer(new Buffer(MsjToA.A + "," + MsjToA.B + "," + MsjToA.Tr + "," + MsjToA.L + "," + data.Po));
            Ps = keys_TTP.privateKey.encrypt(Ps);
            MsjToA.Ps = Ps.toBuffer().toString('base64');
            console.log("MsjToA:");
            console.log(MsjToA);
            conn.write(JSON.stringify(MsjToA));

            var msjToB = {
                A: searchUserByConn(conn),
                L: L,
                Po: data.Po,
                Type: 2
            };

            console.log("msjToB:");
            console.log(msjToB);
            connections[connections2.indexOf(data.B)].write(JSON.stringify(msjToB));
            mensajes[L] = {
                mensaje: data.M,
                from: searchUserByConn(conn),
                to: data.B
            };
            L++;


            break;

        case 2:
            /*    5. TTP → B : L, M
             4. TTP → A : A, B, TD, L, K, PR, PD*/

            var Pd = bignum.fromBuffer(new Buffer(mensajes[data.L].from + "," + mensajes[data.L].to + "," + Date.now() + "," + data.L + "," + data.Pr));
            Pd = keys_TTP.privateKey.encrypt(Pd);
            var pd = Pd.toBuffer().toString('base64');

            var msjFromTTPtoA = {
                A: mensajes[data.L].from,
                B: mensajes[data.L].to,
                Td: Date.now(),
                L: data.L,
                K: "K",
                Pr: data.Pr,
                Pd: pd
            }
            console.log("msjFromTTPtoA:");
            console.log(msjFromTTPtoA);
            connections[connections2.indexOf(mensajes[data.L].to)].write(JSON.stringify(msjFromTTPtoA));

            var msjFromAtoB = {
                L: data.L,
                M: mensajes[data.L].mensaje,
                Type: 3
            };
            if (mensajes[data.L].mensaje == "Juan, esto va a fallar") {
                msjFromAtoB.M = "Ves, ha fallado";
            };


            console.log("msjFromAtoB:");
            console.log(msjFromAtoB);
            conn.write(JSON.stringify(msjFromAtoB));

            break;
        }
    });
    conn.on('close', function () {
        console.log("pepe");
        console.log(connections.filter(function (item) {
            return item.conn.id == conn.id;
        }).nick)

    });
});


var server = https.createServer(options);
chat.installHandlers(server, {
    prefix: '/chat'
});

server.listen(9999, '0.0.0.0');