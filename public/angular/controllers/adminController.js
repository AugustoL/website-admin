angular.module('ALapp.controllers').controller('adminController',['$scope','userService','$location','$window','sessionService', function($scope,userService,$location,$window,sessionService){
	console.log("adminController init");
	$scope.words = sessionService.getStrings();
    $scope.previewLang = $scope.language;
    $scope.posts = [];
	$scope.drafts = [];
	
    userService.getPosts({},0,'-date').then(function(promise){
    	if (promise.data.posts){
			for (var i = promise.data.posts.length - 1; i >= 0; i--) {
				if  (promise.data.posts[i].draft)
					$scope.drafts.push(promise.data.posts[i])
				else 
					$scope.posts.push(promise.data.posts[i])
			};
    	}
    })

    $scope.publishPost = function(postID){
    	userService.publishPost(postID).then(function(promise){
	    	if (promise.data.success) {
	            $location.path('/post').search({ id : postID });
	        }
	    });
    }

    $scope.draftPost = function(postID){
    	userService.draftPost(postID).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
    }

	$scope.editPost = function(postID){
		$location.path('/editPost').search({ id : postID });
	}

	$scope.deletePost = function(postID){
		userService.deletePost(postID).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
	}
    
}]);