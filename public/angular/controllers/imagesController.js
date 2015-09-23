
angular.module('ALapp.controllers').controller('imagesController',['$scope','userService','$location','$window', function($scope,userService,$location,$window){
	console.log("imagesController init");
	$scope.img1 = 'none';
	$scope.img2 = 'none';
	$scope.img3 = 'none';
	$scope.img4 = 'none';
	$scope.img5 = 'none';
    $scope.images = [];

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
		console.log(promise.data);
    	if (promise.data.success)
    		$scope.images = promise.data.images;
    });

	 $('#uploadButton').on('click', function() {
        if (typeof $('#img1').attr("src") !== typeof undefined && $('#img1').attr("src") !== false){
            $scope.img1 = $('#img1').attr("src").toString();
        }
        if (typeof $('#img2').attr("src") !== typeof undefined && $('#img2').attr("src") !== false){
            $scope.img2 = $('#img2').attr("src").toString();
        }
        if (typeof $('#img3').attr("src") !== typeof undefined && $('#img3').attr("src") !== false){
            $scope.img3 = $('#img3').attr("src").toString();
        }
        if (typeof $('#img4').attr("src") !== typeof undefined && $('#img4').attr("src") !== false){
            $scope.img4 = $('#img4').attr("src").toString();
        }
        if (typeof $('#img5').attr("src") !== typeof undefined && $('#img5').attr("src") !== false){
            $scope.img5 = $('#img5').attr("src").toString();
        }
        userService.uploadImages([$scope.img1,$scope.img2,$scope.img3,$scope.img4,$scope.img5]).then(function(promise){
	    	if (promise.data.success) {
	            $window.location.reload();
	        }
	    });
    });
    
}]);