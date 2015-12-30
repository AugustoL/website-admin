
angular.module('ALapp.controllers').controller('imagesController',['$scope','userService','$location','$window', function($scope,userService,$location,$window){
	console.log("imagesController init");
    $scope.images = [];
    $scope.toUpload = [];

	$scope.deleteImage = function(name){
		console.log(name);
		userService.deleteImage(name).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
	}
	$scope.changeNameImg = function(id,name){
		userService.changeNameImg(id,name).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
	}

	userService.getImages().then(function(promise){
    	if (promise.data.success)
    		$scope.images = promise.data.images;
    });

	 $('#uploadButton').on('click', function() {
	 	$('.imageInput').each(function(index) {
		  	if (typeof $(this).attr("src") !== typeof undefined && $(this).attr("src") !== false){
	            $scope.toUpload.push($(this).attr("src").toString());
	        }
		});
		userService.uploadImages($scope.toUpload).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
    });
    
}]);