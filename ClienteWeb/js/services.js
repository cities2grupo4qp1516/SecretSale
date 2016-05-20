secretSale.value('version', '0.1')

.factory('rsaKey', ['BigInteger', 'primeNumber', function (BigInteger, primeNumber) {
    var rsa = {
        publicKey: function (bits, n, e) {
            this.bits = bits;
            this.n = n;
            this.e = e;
        },
        privateKey: function (p, q, d, publicKey) {
            this.p = p;
            this.q = q;
            this.d = d;
            this.publicKey = publicKey;
        },
        importKeys: function (impotedKeys) {
            var keys = {};
            impotedKeys.privateKey.publicKey.e = new BigInteger(impotedKeys.privateKey.publicKey.e);
            impotedKeys.privateKey.publicKey.n = new BigInteger(impotedKeys.privateKey.publicKey.n);
            keys.publicKey = new rsa.publicKey(impotedKeys.publicKey.bits, new BigInteger(impotedKeys.publicKey.n), new BigInteger(impotedKeys.publicKey.e));
            keys.privateKey = new rsa.privateKey(new BigInteger(impotedKeys.privateKey.p), new BigInteger(impotedKeys.privateKey.q), new BigInteger(impotedKeys.privateKey.d), impotedKeys.privateKey.publicKey);
            return keys;
        },
        generateKeys: function (bitlength) {
            var p, q, n, phi, e, d, keys = {},
                one = new BigInteger('1');
            this.bitlength = bitlength || 2048;
            console.log("Generating RSA keys of", this.bitlength, "bits");
            p = primeNumber.aleatorio(bitlength);
            do {
                q = primeNumber.aleatorio(bitlength);
            } while (q.compareTo(p) === 0);
            n = p.multiply(q);

            phi = p.subtract(one).multiply(q.subtract(one));

            e = new BigInteger('65537');
            d = e.modInverse(phi);

            keys.publicKey = new rsa.publicKey(this.bitlength, n, e);
            keys.privateKey = new rsa.privateKey(p, q, d, keys.publicKey);
            return keys;
        },
        String2bin: function (str) {
            var bytes = [];
            for (var i = 0; i < str.length; ++i) {
                bytes.push(str.charCodeAt(i));
            }
            return bytes;
        },
        bin2String: function (array) {
            var result = "";
            for (var i = 0; i < array.length; i++) {
                result += String.fromCharCode(array[i]);
            }
            return result;
        }
    };


    rsa.publicKey.prototype = {
        encrypt: function (m) {
            return m.modPow(this.e, this.n);
        },
        decrypt: function (c) {
            return c.modPow(this.e, this.n);
        },
        dec: function (c, pass, passs) {
            return c.modPow(pass, passs);
        }
    };

    rsa.privateKey.prototype = {
        encrypt: function (m) {
            return m.modPow(this.d, this.publicKey.n);
        },
        decrypt: function (c) {
            return c.modPow(this.d, this.publicKey.n);
        }
    };
    return rsa;
}])

.factory('primeNumber', ['BigInteger', function (BigInteger) {
    Decimal.config({
        precision: 300,
        rounding: 4,
        toExpNeg: -7,
        toExpPos: 100,
        maxE: 9e15,
        minE: -9e15
    });
    var primo = {
        aleatorio: function (bitLength) {
            var isPrime = false;
            var diff = Decimal.sub(Decimal.pow(2, bitLength), Decimal.pow(2, bitLength - 1));
            while (!isPrime) {
                var randomNumber = Decimal.add((Decimal.mul(Decimal.random(300), Decimal.pow(2, bitLength)).round()), diff);
                var rnd = new BigInteger(randomNumber.toString());
                if (rnd.isProbablePrime(3)) {
                    isPrime = true;
                }
            }
            return rnd;
        }
    };
    return primo;
}])

.factory('Base64', [function () {
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function (e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }
    return Base64;
    }])

.factory('mySocket', ['socketFactory', '$rootScope', 'BigInteger', 'rsaKey', 'Base64', 'config', '$http', '$cookies', function (socketFactory, $rootScope, BigInteger, rsaKey, Base64, config, $http, $cookies) {
    function sendMessage(mensaje) {
        mySocket.send(mensaje);
    };

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
    var sockjs = new SockJS('https://localhost:9999/chat');
    var respuestaTTP = "";
    $rootScope.mensajes = [];
    sockjs.onopen = function () {
        function sendMessage(mensaje) {
            sockjs.send(mensaje);
        };

        var token = $cookies.getObject("token");
        console.log(token);
        if (token != undefined) {
            if (token.tipo == "vendedor") {
                sendMessage(JSON.stringify({
                    tipo: 0,
                    nombre: token.nick
                }));
            }
        }
    };
    $rootScope.esta = false;
    sockjs.onmessage = function (e) {
        console.log($rootScope.keys);
        console.log(e.data);
        var mensaje = JSON.parse(e.data);
        switch (mensaje.Type) {
        case 12:

            $rootScope.r = (Math.floor(Math.random() * 1574) + 1);
            $rootScope.rnd = new BigInteger($rootScope.r.toString());
            $rootScope.g = new BigInteger(mensaje.g.toString());
            $rootScope.p = new BigInteger(mensaje.p.toString());
            //g^randmodp
            var total = $rootScope.g.modPow($rootScope.rnd, $rootScope.p);
            console.log(total.toString());

            sendMessage(JSON.stringify({
                tipo: 23,
                mensaje: total.toString(),
                para: $rootScope.hablandocon,
                de: $cookies.getObject("token").nick
            }));
            break;
        case 90:
            $rootScope.verChat = true;

            $rootScope.$apply(function (scope) {
                $rootScope.hablandocon = mensaje.cliente;

            });
            console.log(mensaje.cliente);
            break;
        case 24:
            if (!$rootScope.esta) {
                $rootScope.esta = true;
                var msj = new BigInteger(mensaje.mensaje);
                console.log(msj.modPow($rootScope.rnd, $rootScope.p).toString());
                $rootScope.clave = msj.modPow($rootScope.rnd, $rootScope.p).toString();
            } else {
                mensaje.mensaje = rc4($rootScope.clave, mensaje.mensaje)
                $rootScope.$apply(function (scope) {
                    $rootScope.mensajes.push(mensaje);
                });
            }
            break;
        case 2:
            $rootScope.LandP0[mensaje.L] = mensaje.Po;
            var msjToEncrypt = "TTP, B, " + mensaje.L + mensaje.Po;
            var bytes = new BigInteger(rsaKey.String2bin(msjToEncrypt));
            var Pr = Base64.encode($rootScope.keys.privateKey.encrypt(bytes).toString());

            var msjToTTP = {
                tipo: 2,
                L: mensaje.L,
                Pr: Pr
            };

            sockjs.send(JSON.stringify(msjToTTP));
            break;

        case 3:
            $rootScope.currentConversation.n++;
            $rootScope.currentConversation.messages.push({
                me: false,
                text: mensaje.M,
                ticks: [true, false, false, false, false]
            });
            $http.get(config.URLTTP + 'getKey/B').success(function (diferente) {
                console.log("Ahi van las claves publicas!: ");
                console.log(diferente);

                var camacho = rsaKey.bin2String($rootScope.keys.publicKey.dec(new BigInteger(Base64.decode($rootScope.LandP0[mensaje.L])), new BigInteger(diferente.e), new BigInteger(diferente.n)).toByteArray()).split(",")[2] == sha256(mensaje.M) ? function () {
                    console.log("mensaje correcto");
                    $rootScope.currentConversation.messages[$rootScope.currentConversation.n].ticks = [false, false, true, true, false];
                } : function () {
                    console.log("mensaje incorrecto");
                    $rootScope.currentConversation.messages[$rootScope.currentConversation.n].ticks = [false, false, false, false, true];
                };

                camacho();

            }).error(function (err) {
                console.log("Muy mal pollito = " + err);
            });
            break;

        }
    };

    mySocket = socketFactory({
        socket: sockjs
    });

    return mySocket;
}]);