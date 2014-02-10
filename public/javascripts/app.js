google.load("feeds", "1");
(function() {
  /* On jQuery "ready" event of document */
  angular
    .module( "mwpControllers", [])
    .controller( "homeController", function() {})
    .controller( "navController", function($scope) {
      $scope.controllerName = "homeController";
      $scope.$on("$routeChangeSuccess", function(ev, current) {   
        $scope.controllerName = current.controller;
      });  
    })
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
    .controller( "phoneController", function($scope, $timeout, $cookies) {
      $scope.onLoading = false;
      $scope.showLoadingSuccessHint = false;
      $scope.fetchAmount = parseInt($cookies.fetchAmount || 5, 10);
      $scope.newsItems = [];      

      $scope.getNews = function() {
        $cookies.fetchAmount = $scope.fetchAmount;
        $scope.onLoading = true;

        var feed = new google.feeds.Feed( "http://feeds.feedburner.com/Mobilecrunch" );
        feed.setNumEntries( $scope.fetchAmount );
        feed.setResultFormat( google.feeds.Feed.JSON_FORMAT );
        feed.load(function(result) {
          $timeout(function() {
            $scope.onLoading = false;
            if (!result.error) {
              $scope.newsItems = [];
              var feedEntries = result.feed.entries; 
              var maxLength = feedEntries.length;
              for (var i = 0; i < maxLength; i++) {
                $scope.newsItems.push(feedEntries[i]);
              }

              // Notice user that news are loaded success
              $scope.showLoadingSuccessHint = true;
              $timeout(function() {
                $scope.showLoadingSuccessHint = false;
              }, 2000);
            }
          }); 
        });
      };
    });
  angular
    .module("mwp", [ 
        "ngRoute" /* enable routing */, 
        "ngCookies" /* access to browser cookie */,
        "mwpControllers" ])
    .directive("void", function() {
      return {
        restrict  : "A",
        compile   : function(ele) {
          ele.attr("href", "javascript:void(0);");
        }
      };
    })
    .directive("openNew", function() {
      return {
        restrict  : "A",
        compile   : function(ele) {
          ele.attr("target", "news");
        }
      };
    })
    .directive("share", function() {
      return {
        restrict        : "E",
        template        : 
          "<div>" +
            "<a open-new ng-href=\"http://www.facebook.com/sharer.php?u={{url}}\" title=\"Share on Facebook\"><span class=\"glyphicon glyphicon-thumbs-up\"></span></a>" +
            "&nbsp;<a open-new title=\"Share on LinkedIn\" ng-href=\"http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{description}}\"><span class=\"glyphicon glyphicon-user\"></span></a>" +
            "&nbsp;<a open-new title=\"Share on Google Plus\" ng-href=\"https://plus.google.com/share?url={{url}}\"><span class=\"glyphicon glyphicon-plus\"></span></a>" +
          "</div>",
        replace         : true,
        scope           : {
          url           : "@",
          title         : "@",
          description   : "@"
        }
      };
    })
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
