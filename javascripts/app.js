google.load("feeds", "1");
(function() {
  /* On jQuery "ready" event of document */
  angular
    .module( "adaControllers", [])
    .controller( "homeController", function() {})
    .controller( "navController", function($scope) {
      $scope.controllerName = "homeController";
      $scope.$on("$routeChangeSuccess", function(ev, current) {   
        $scope.controllerName = current.controller;
      });  
    })
    .controller( "simpleDemoController", function($scope) {
      $scope.accountRegistrationError = false;
      $scope.accountRegistrationSuccess = false;
      $scope.registerNewAccount = function() {
        $scope.accountRegistrationError = false;
        $scope.accountRegistrationSuccess = false;
        if( $scope.accountName && $scope.captchaText && $scope.captchaText == $scope.generatedCaptchaText ) {
          $scope.accountRegistrationSuccess = true;
          $scope.generateCaptchaText();
          $scope.captchaText = null;
          $scope.accountName = null;
        }
        else {
          $scope.accountRegistrationError = true;
        }
      };
      $scope.generateCaptchaText = function () {
        /* Use Faker (https://github.com/Marak/Faker.js) to generate dummy data */
        $scope.generatedCaptchaText = Faker.Lorem.words(1)[0] + Faker.Helpers.randomNumber(10000);
      };

      $scope.generateCaptchaText();
    })
    .controller( "advanceDemoController", function($scope, $timeout, storage /* inject our service */, getFeeds /* inject our factory */) {
      $scope.onLoading = false;
      $scope.showLoadingSuccessHint = false;
      $scope.fetchAmount = storage.fetchAmount();
      $scope.newsItems = [];      

      $scope.getNews = function() {
        storage.fetchAmount($scope.fetchAmount);
        $scope.onLoading = true;

        getFeeds($scope.fetchAmount).then(function(result) {
          $scope.onLoading = false;
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
        });
      };
    });
  angular
    .module("ada", [ 
        "ngRoute" /* enable routing */, 
        "ngCookies" /* access to browser cookie */,
        "adaControllers" ])
    .value("feedUrl", "http://feeds.feedburner.com/Mobilecrunch")
    .factory("getFeeds", [ "$q", "feedUrl", function($q, feedUrl) {
      return function(numEntries) {
        var feed = new google.feeds.Feed( feedUrl );
        var deferred = $q.defer();
        feed.setNumEntries( numEntries );
        feed.setResultFormat( google.feeds.Feed.JSON_FORMAT );
        feed.load( function(result) {
          if( result.error ) deferred.reject(result.error);
          else deferred.resolve(result);
        });
        return deferred.promise;
      }
    }])
    .service("storage", [ "$cookies", function($cookies) {
      this.fetchAmount = function(val) {
        if(val == undefined) {
          return parseInt($cookies.fetchAmount || 5, 10);
        }

        $cookies.fetchAmount = val;
      };
    }])
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
    .filter('toEmailName', function() {
      return function(input) {
        return input.replace(/\s+/g, "-");
      }
    })
    .config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when( "/", { 
          templateUrl: "home.html",
          controller: "homeController"
        })
        .when( "/simple-demo", { 
          templateUrl: "simple-demo.html",
          controller: "simpleDemoController"
        })
        .when( "/advance-demo", { 
          templateUrl: "advance-demo.html",
          controller: "advanceDemoController"
        });
    }]);

})();
