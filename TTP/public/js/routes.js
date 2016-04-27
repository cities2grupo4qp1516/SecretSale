
secretSale.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('/', {
            url: "/"
            , templateUrl: "views/validar.html"
        }).state('/pseudonimo', {
            url: "/pseudonimo",
            templateUrl: "views/pseudonimo.html"
        });
});
