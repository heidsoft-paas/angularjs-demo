(function() {
  angular
    .module( "mwpControllers", [])
    .controller( "navController", function($scope) {
      $scope.controllerName = "homeController";
      $scope.$on("$routeChangeSuccess", function(ev, current) {   
        $scope.controllerName = current.controller;
      });  
    })
    .controller( "homeController", function() {})
    .controller( "helloWorldController", function($scope) {
      $scope.accountRegistrationError = false;
      $scope.accountRegistrationSuccess = false;
      $scope.registerNewAccount = function() {
        $scope.accountRegistrationError = false;
        $scope.accountRegistrationSuccess = false;
        if( $scope.accountKey && $scope.accountName ) {
          $scope.accountRegistrationSuccess = true;
          $scope.accountKey = null;
          $scope.accountName = null;
        }
        else {
          $scope.accountRegistrationError = true;
        }
      };
      $scope.generateAccountKey = function () {
        /* I use Faker (https://github.com/Marak/Faker.js) to generate dummy data */
        $scope.accountKey = Faker.Lorem.words(1)[0] + Faker.Helpers.randomNumber(10000);
      };
    })
    .controller( "phoneController", function($scope, $http) {
      $scope.loadingNews = false;
      /*
        For demo purpose, I used Google Feed JSON API to generate json format from rss xml. Check out this link for how to use the tool: https://developers.google.com/feed/v1/jsondevguide#json_reference
        The url I used to generate news.json file is (try out by copying and pasting to your browser now to see the magic) https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://feeds.feedburner.com/pocketnow&num=20
        var promise = $http.get("news.json");
        promise["finally"](function() { $scope.loadingNews = false; });
        promise.success(function(data) {
          $scope.accountAccountKey = Math.floor(data);
          // var jFeed = $(data);
          console.log(data.feed.entries.length);
        });*/

    });
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
     }]);
})();
