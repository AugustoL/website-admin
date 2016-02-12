angular.module('ALapp.controllers').controller('commentsController',['$scope','$routeParams','$location','userService','sessionService','$sce', function($scope,$routeParams,$location,userService,sessionService,$sce){
	console.log("commentsController init");
    $scope.previewLang = navigator.language || navigator.userLanguage;
    if ($scope.previewLang != "es")
        $scope.previewLang = 'en';
    $scope.words = sessionService.getStrings();
	$scope.comments = [];

    userService.getPost($routeParams.id).then(function(promise){
        console.log(promise.data);
        $scope.comments = promise.data.post.comments;
    })

    $scope.deleteComment = function(comment){
        console.log(comment)
        userService.deleteComment($routeParams.id,comment.id).then(function(promise){
            console.log(promise.data);
        })
    }

}]);