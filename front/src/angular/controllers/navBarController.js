angular.module('ALapp.controllers').controller('navBarController',['$scope','sessionService','$window', function($scope,sessionService,$window){
    console.log("navBarController init");
    $scope.words = sessionService.getStrings();
    $scope.language = $scope.words.language;
    $scope.backendDomain = "http://"+$window.location.hostname+":3011";
    $scope.changeLang = function(lang){
    	$scope.words = sessionService.getStrings(lang);
    	$scope.language = lang;
    }
}]);