(function() {
  angular
    .module("mwp", [ "ngRoute" ])
    .config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when( "/", { 
          templateUrl: "home.html"
        })
        .when( "/news", { 
          templateUrl: "news.html"
        })
        .when( "/phones", { 
          templateUrl: "phones.html"
        })
        .otherwise({ redirectTo: "/" });
    }]);
})();
