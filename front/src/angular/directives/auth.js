angular.module('ALapp.directives').directive('auth', function () {
    return {
        restrict: 'A',
        templateUrl: '/directives/auth.html',
        controller: 'authController as authCtrl'
    };
});