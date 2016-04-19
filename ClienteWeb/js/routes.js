var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function ($stateProvider, $urlRouterProvider) {



    $urlRouterProvider.otherwise("404");

    $stateProvider
        .state('state1', {
            url: "/",
            templateUrl: "views/vista.html"
        }).state('404', {
            url: "/404",
            templateUrl: "views/404.html"
        });
});