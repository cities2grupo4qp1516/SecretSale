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

var secretSale = angular.module('secretSale', ['jsbn.BigInteger', 'ui.router', 'uiRouterStyles', 'oitozero.ngSweetAlert', 'validation', 'validation.rule']);

secretSale.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise("404");

    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "views/vista.html"

        }).state('404', {
            url: "/404",
            templateUrl: "views/404.html",
            data: {
                css: ['views/css/style-left-red.css', 'bower_components/vegas/dist/vegas.css', 'bower_components/animate.css/animate.min.css']
            }

        }).state('/reg_vendedor', {
            url: "/reg_vendedor",
            templateUrl: "views/reg_vendedor.html",
            data: {
                css: ['views/css/objetos.css']
            }

        }).state('/login_vendedor', {
            url: "/login_vendedor",
            templateUrl: "views/login_vendedor.html",
            data: {
                css: ['views/css/objetos.css']
            }

        })
	.state('/objetos', {
            url: "/objetos",
            templateUrl: "views/objetos.html",
            data: {
                css: ['views/css/objetos.css']
            }

        }).state('/cliente', {
            url: "/cliente",
            templateUrl: "views/cliente.html",
            data: {
                css: ['views/css/objetos.css']
            }

        }).state('/lista', {
            url: "/lista",
            templateUrl: "views/listaObjetos.html"
        });
});

secretSale.run(function ($templateCache, $http) {
    $http.get('views/404.html', {
        cache: $templateCache
    });

    $http.get('views/cliente.html', {
        cache: $templateCache
    });

    $http.get('views/listaObjetos.html', {
        cache: $templateCache
    });

    $http.get('views/objetos.html', {
        cache: $templateCache
    });

    $http.get('views/reg_vendedor.html', {
        cache: $templateCache
    });

    $http.get('views/vista.html', {
        cache: $templateCache
    });

});
