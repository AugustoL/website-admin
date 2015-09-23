
app.config(['$routeProvider', function ($routeProvider) {
	
    //ALapp
    $routeProvider.when('/',{ templateUrl: '/templates/admin.html', controller : 'adminController' });
    $routeProvider.when('/createPost',{ templateUrl: '/templates/createPost.html', controller : 'createController' })
    $routeProvider.when('/editPost',{ templateUrl: '/templates/editPost.html', controller : 'editController' });
    $routeProvider.when('/images',{ templateUrl: '/templates/images.html', controller : 'imagesController' });
    //Otherwise
    $routeProvider.otherwise({redirectTo: '/'});

}]).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
