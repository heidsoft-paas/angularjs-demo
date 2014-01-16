(function() {
  angular
    .module( "mwpControllers", [])
    .controller( "homeController", function() {

    })
    .controller( "helloWorldController", function($scope, $http) {
      $scope.appUptime = 0;
      $scope.ajaxLoading = false;
      $scope.getUptime = function () {
        $scope.ajaxLoading = true;
        var promise = $http.get("api/uptime");
        promise["finally"](function() { $scope.ajaxLoading = false; });
        promise.success(function(data) {
          $scope.appUptime = Math.floor(data);
        });
      };
    })
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
        .when( "/hello-world", { 
          templateUrl: "helloworld.html",
          controller: "helloWorldController"
        })
        .when( "/phones", { 
          templateUrl: "phones.html",
          controller: "phoneController"
        });
    }])
    .run(function($rootScope) {
      $rootScope.controllerName = "homeController";
      $rootScope.$on("$routeChangeSuccess", function(ev, current) {   
        $rootScope.controllerName = current.controller;
      });  
    });
})();
