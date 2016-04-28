secretSale.constant('config', {
    URLSSS: "http://localhost:3000/",
    URLTTP: "http://localhost:3000/"
});

secretSale.controller("objetosController", function ($scope, $http, config, SweetAlert, $injector) {
    $scope.objeto = {};
    var foto;
    $scope.ojo = false;
    var $validationProvider = $injector.get('$validation');


    $scope.fotoVer = function () {
        //sweetAlert("Esta es tu foto", "<img src=''>");
        SweetAlert.swal({
                title: "Esta es tu foto",
                text: "<img src='" + foto + "'>",
                html: true
            },
            function () {});
    }
    $scope.file_changed = function (element) {
        $scope.ojo = true;

        $scope.$apply(function (scope) {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                // handle onload
                // no no no nooooooo console.log(e.target.result);
                foto = e.target.result;
            };
            reader.readAsDataURL(photofile);
        });
    };

    $scope.subirObjeto = function () {
        var fd = new FormData();
        fd.append('nombre', $scope.objeto.nombre);
        fd.append('descripcion', $scope.objeto.descripcion);
        fd.append('vendedor', $scope.objeto.vendedor);
        fd.append('precio', $scope.objeto.precio);
        fd.append('tipo', $scope.objeto.tipo);
        fd.append('file', $scope.foto);

        $http.post(config.URLSSS + "objetos/nuevo/", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (data) {
            SweetAlert.swal({
                    title: "Producto añadido correctamente",
                    type: "success",
                    confirmButtonText: "Continuar",
                },
                function () {
                    console.log("weee");
                });
        }).error(function (data) {
            console.log(data);
            sweetAlert("Oops...", data, "error");
        });
    }
});

secretSale.controller("clienteController", function ($scope, $http, config) {
    var paisfinal;
    var generofinal;
    var cliente = {};

    $scope.showSelectValue1 = function (genero) {
        console.log(genero)
        generofinal = genero;

    }

    $scope.showSelectValue2 = function (pais) {
        console.log(pais)
        paisfinal = pais;
    }

    $scope.registrarUsuario = function () {
        cliente = {
            nick: $scope.cliente.nick,
            nombre: $scope.cliente.nombre,
            apellidos: $scope.cliente.apellidos,
            password: $scope.cliente.password,
            mail: $scope.cliente.mail,
            edad: $scope.cliente.edad,
            pais: paisfinal,
            genero: generofinal
        }
        $http.post(config.URLTTP + 'users/usuarios', cliente)
            .success(function (data) {

            })
            .error(function (dataa) {
                console.log('Error: ' + dataa + "");
            });
    }
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
}]);