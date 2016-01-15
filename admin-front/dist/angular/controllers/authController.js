angular.module('ALapp.controllers').controller('authController',['$scope','sessionService','$window', function($scope,sessionService,$window){
    console.log("authController init");
    if (!sessionService.getItem('auth')){
    	$('#authModal').modal('show');
    }
    $scope.auth = {
    	username : "",
    	password : ""
    }

    $scope.saveAuth = function(){
    	console.log($scope.auth.username+":"+$scope.auth.password);
    	if ($scope.auth.username.length > 6 && $scope.auth.password.length > 6){
    		sessionService.addItem('auth',$scope.auth.username+":"+$scope.auth.password);
    		$window.location.reload();
    	}
    	
    }
}]);