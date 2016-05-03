var secretSale = angular.module('secretSale', ['jsbn.BigInteger', 'ui.router']);

secretSale.constant('config', {
    URLSSS: "http://localhost:3000/",
    URLTTP: "http://localhost:5000/"
});

secretSale.controller("RegVendedorController", function ($scope, UtilSrvc, $http, config, BigInteger, rsaKey, $state, Base64) {
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    $scope.claves = false;
    $scope.prep = false;
    $scope.generar = true;
    $scope.ver = false;
    $scope.label_seudo = false;

    var keys;
    var seudo_Kpub;
    $scope.cif = "";
    $scope.direccion = "";
    $scope.email = "";
    $scope.telf = "";
    $("#seudo").hide();


    var publickey = {
        bits: "",
        n: "",
        e: ""
    };

    $http.get(config.URLTTP + 'firma_ciega/publicKey')
        .success(function (data) {
            publickey = {
                bits: data.bits,
                n: data.n,
                e: data.e
            };



        })
        .error(function (data) {
            console.log('Error: ' + data);

        });


    $scope.validar = function () {
        if ($scope.cif == "" || $scope.direccion == "" || $scope.email == "" || $scope.telf == "") {
            console.log("Debes rellenar todos los campos");
        } else {
            $("#contact").fadeOut(2000);
            setTimeout(function () {
                $("#seudo").fadeIn(2000);
            }, 2000);
        }


    };

    $scope.generar = function () {
        $scope.claves = false;
        keys = rsaKey.generateKeys(128);

        $scope.claves = true;
        $scope.label_seudo = true;
        $scope.generar = false;
        $scope.ver = true;
        $scope.prep = true;
        $( "#ver" ).trigger( "click" );

        $scope.public = {
          n: keys.publicKey.n.toString(),
          e: keys.publicKey.e.toString()
        };
        $scope.private = {
          d: keys.privateKey.d.toString()
        };
    };

    $scope.guardar_keys = function () {

        var keysToFile = {
            publicKey: {
                n: keys.publicKey.n.toString(),
                e: keys.publicKey.e.toString(),
                bits: keys.publicKey.bits
            },
            privateKey: {
                p: keys.privateKey.p.toString(),
                q: keys.privateKey.q.toString(),
                d: keys.privateKey.d.toString(),
                publicKey: {
                    n: keys.publicKey.n.toString(),
                    e: keys.publicKey.e.toString(),
                    bits: keys.publicKey.bits
                }
            }
        };
        var file = "";
        var data = new Blob([Base64.encode(JSON.stringify(keysToFile))], {
            type: 'text/plain'
        });

        if (file !== null) {
            window.URL.revokeObjectURL(file);
        }

        file = window.URL.createObjectURL(data);
        downloadURI(file, "keys.RSA");

    };

    $scope.preparar = function (seudonimo) {
      $scope.seudo_Kpub = {
        seudonimo: seudonimo,
        n: keys.publicKey.n.toString(),
        e: keys.publicKey.e.toString()
        };

    };

    $scope.enviar = function (seudonimo) {


        seudo_Kpub = seudonimo + "," + keys.publicKey.n.toString() + "," + keys.publicKey.e.toString();
        var seudo_Kpub_64 = Base64.encode(seudo_Kpub);
        console.log(seudo_Kpub_64);

        var digest = sha256(seudo_Kpub);
        var hash = {
            hash: digest
        };

        console.log("HASH: " + digest);
        var diff = Decimal.sub(Decimal.pow(2, publickey.bits), Decimal.pow(2, publickey.bits - 1));
        var randomNumber = Decimal.add((Decimal.mul(Decimal.random(300), Decimal.pow(2, publickey.bits)).round()), diff);
        var r = new BigInteger(randomNumber.toString());

        console.log("R: " + r);

        var m = new BigInteger(hash.hash, 16);
        var e = new BigInteger(publickey.e);
        var n = new BigInteger(publickey.n);
        var bc = m.multiply(r.modPow(e, n)).mod(n);

        var blindMsg = {
            blind: bc.toString(10)
        };
        console.log('blind msg   m·r^e mod n:', '\n', blindMsg.blind.toString(10), '\n');

        $http.post(config.URLTTP + 'firma_ciega', JSON.stringify(blindMsg))
            .success(function (data) {

                var teta = new BigInteger(data.teta);
                var c = teta.multiply(r.modInverse(n)).mod(n);
                $scope.c = c.toString();
                var publicKeyTTP = new rsaKey.publicKey(publickey.bits, n, e);

                console.log("Firma TTP: " + c);

                var d = publicKeyTTP.decrypt(c);

                console.log("Desencriptado Firma: " + d.toString(16));

                $scope.sign = true;

            })
            .error(function (dataa) {
                console.log('Error: ' + dataa);

            });

    };

    $scope.guardar = function (c) {

        var seudo_Kpub_sign = seudo_Kpub + "," + c;
        var a = Base64.encode(seudo_Kpub_sign);
        var b = Base64.decode(a);
        console.log("Base64: " + a);
        console.log("DesBase64: " + b);
        var g = new Array();
        g = b.split(',');

        for (var i = 0; i < g.length; i++) {
            console.log(g[i] + " -- ");

        };

        var file = "";
        var data = new Blob([Base64.encode(seudo_Kpub_sign)], {
            type: 'text/plain'
        });

        if (file !== null) {
            window.URL.revokeObjectURL(file);
        }

        file = window.URL.createObjectURL(data);
        downloadURI(file, "PID_firmado.RSA");

    };



})

.controller("MyCtrl2", function ($scope) {

    }).factory('rsaKey', ['BigInteger', 'primeNumber', function (BigInteger, primeNumber) {
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
}]).factory('Base64', [function () {
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
}]);
