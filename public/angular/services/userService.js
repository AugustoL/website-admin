
angular.module('ALapp.services').factory('userService', ['$http', function ($http) {

    var factory = {};

    //Get Posts
    factory.getPosts= function (findBy,skip,sort) {
        var promise = $http({method: 'GET',
            url: '/getPosts',
            params: { findBy : findBy, skip : skip, sort : sort }
        });
        return promise;
    }

    factory.getMonths= function () {
        var promise = $http({method: 'GET',
            url: '/getMonths',
            params: {}
        });
        return promise;
    }

    factory.getCategories= function () {
        var promise = $http({method: 'GET',
            url: '/getCategories',
            params: {}
        });
        return promise;
    }

    //Get Post by id
    factory.getPost= function (id) {
        var promise = $http({method: 'GET',
            url: '/getPost',
            params: { id : id }
        });
        return promise;
    }

    //Cretae post liek draft only with tytle, then move to edit
    factory.createPost = function(){
        var promise = $http({
            method: 'POST',
            url: '/createPost'
        });
        return promise;
    }

    //Create new post
    factory.createPost = function(titleEs,titleEn,img,categories,bodyEs,bodyEn){
        var promise = $http({
            method: 'POST',
            url: '/createPost',
            params: { titleEs : titleEs, titleEn : titleEn, img : img, categories : categories, bodyEn : bodyEn, bodyEs : bodyEs}
        });
        return promise;
    }

    //Edit post with id
    factory.editPost = function(titleEs,titleEn,img,categories,bodyEs,bodyEn,id){
        var promise = $http({
            method: 'POST',
            url: '/editPost',
            params: { titleEs : titleEs, titleEn : titleEn, img : img, categories : categories, bodyEn : bodyEn, bodyEs : bodyEs, id : id}
        });
        return promise;
    }

    //Publish post with id
    factory.publishPost = function(id){
        var promise = $http({
            method: 'POST',
            url: '/publishPost',
            params: { id : id}
        });
        return promise;
    }

    //Make draft post with id
    factory.draftPost = function(id){
        var promise = $http({
            method: 'POST',
            url: '/draftPost',
            params: { id : id}
        });
        return promise;
    }

    //Delete post with id
    factory.deletePost = function(id){
        var promise = $http({
            method: 'POST',
            url: '/deletePost',
            params: { id : id}
        });
        return promise;
    }

    //Upload imgs
    factory.uploadImages = function(images){
        var promise = $http({
            method: 'POST',
            url: '/uploadImages',
            data: { images : images}
        });
        return promise;
    }

    factory.deleteImage = function(name){
        var promise = $http({
            method: 'POST',
            url: '/deleteImage',
            params: { name : name }
        })
        return promise;
    }

    factory.changeNameImg = function(id,name){
        var promise = $http({
            method: 'POST',
            url: '/changeNameImg',
            params: { id : id, name : name }
        })
        return promise;
    }

    factory.getImages = function(){
        var promise = $http({
            method: 'GET',
            url: '/getImages'
        })
        return promise;
    }

    return factory;
}]);