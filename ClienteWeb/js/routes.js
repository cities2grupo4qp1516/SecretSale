var secretSale = angular.module('secretSale', ['jsbn.BigInteger', 'ui.router', 'uiRouterStyles']);

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
            templateUrl: "views/reg_vendedor.html"
        }).state('/objetos', {
            url: "/objetos",
            templateUrl: "views/objetos.html"
        });
});

secretSale.run(function ($templateCache, $http) {
    $http.get('views/404.html', {
        cache: $templateCache
    });

    $http.get('views/vista.html', {
        cache: $templateCache
    });

});