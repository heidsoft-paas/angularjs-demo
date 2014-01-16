(function() {
  angular
    .module( "mwpControllers", [])
    .controller( "homeController", function() {})
    .controller( "newsController", function() {})
    .controller( "phoneController", function() {});
  angular
    .module("mwp", [ "ngRoute", "mwpControllers" ])
    .config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when( "/", { 
          templateUrl: "home.html",
          controller: "homeController"
        })
        .when( "/news", { 
          templateUrl: "news.html",
          controller: "newsController"
        })
        .when( "/phones", { 
          templateUrl: "phones.html",
          controller: "phoneController"
        })
        .otherwise({ redirectTo: "/" });
    }])
    .run(function($rootScope) {
      $rootScope.controllerName = "homeController";
      $rootScope.$on("$routeChangeSuccess", function(ev, current) {   
        $rootScope.controllerName = current.controller;
      });  
    });
})();
