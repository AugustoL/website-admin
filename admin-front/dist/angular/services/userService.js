
angular.module('ALapp.services').factory('userService', ['$http','$window','sessionService', function ($http,$window,sessionService) {

    var auth = sessionService.getItem('auth') || "";
    var backendDomain = "http://"+$window.location.hostname+":3011";
    var factory = {};
    $http.defaults.headers.common.auth = auth.toString();

    function makeRequest(http){
        var promise = $http(http).then(function successCallback(response) {
            if (response.data.err == 'bad auth')
                $('#authModal').modal('show');
            return response;
        }, function errorCallback(response) {
            return response;
        });
        return promise;
    }

    //Get Posts
    factory.getPosts= function (findBy,skip,sort) {
        var promise = makeRequest({
            method: 'GET',
            url: backendDomain+'/getPosts',
            params: { findBy : findBy, skip : skip, sort : sort }
        });
        return promise;
    }

    factory.getMonths= function () {
        var promise = makeRequest({
            method: 'GET',
            url: backendDomain+'/getMonths',
            params: {}
        });
        return promise;
    }

    factory.getCategories= function () {
        var promise = makeRequest({
            method: 'GET',
            url: backendDomain+'/getCategories'
        });
        return promise;
    }

    //Get Post by id
    factory.getPost= function (id) {
        var promise = makeRequest({
            method: 'GET',
            url: backendDomain+'/getPost',
            params: { id : id }
        });
        return promise;
    }

    //Cretae post liek draft only with tytle, then move to edit
    factory.createPost = function(){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/createPost'
        });
        return promise;
    }

    //Create new post
    factory.createPost = function(titleEs,titleEn,img,categories,bodyEs,bodyEn){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/createPost',
            params: { titleEs : titleEs, titleEn : titleEn, img : img, categories : categories, bodyEn : bodyEn, bodyEs : bodyEs}
        });
        return promise;
    }

    //Edit post with id
    factory.editPost = function(titleEs,titleEn,img,categories,bodyEs,bodyEn,id){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/editPost',
            params: { titleEs : titleEs, titleEn : titleEn, img : img, categories : categories, bodyEn : bodyEn, bodyEs : bodyEs, id : id}
        });
        return promise;
    }

    //Publish post with id
    factory.publishPost = function(id){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/publishPost',
            params: { id : id}
        });
        return promise;
    }

    //Make draft post with id
    factory.draftPost = function(id){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/draftPost',
            params: { id : id}
        });
        return promise;
    }

    //Delete post with id
    factory.deletePost = function(id){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/deletePost',
            params: { id : id}
        });
        return promise;
    }

    //Upload imgs
    factory.uploadImages = function(images){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/uploadImages',
            data: { images : images}
        });
        return promise;
    }

    factory.deleteImage = function(name){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/deleteImage',
            params: { name : name }
        })
        return promise;
    }

    factory.changeNameImg = function(id,name){
        var promise = makeRequest({
            method: 'POST',
            url: backendDomain+'/changeNameImg',
            params: { id : id, name : name }
        })
        return promise;
    }

    factory.getImages = function(){
        var promise = makeRequest({
            method: 'GET',
            url: backendDomain+'/getImages'
        })
        return promise;
    }

    return factory;
}]);