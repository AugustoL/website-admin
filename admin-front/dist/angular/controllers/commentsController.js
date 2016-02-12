/*
 AugustoLemble 2016-02-12 
*/
angular.module("ALapp.controllers").controller("commentsController",["$scope","$routeParams","$location","userService","sessionService","$sce",function(a,b,c,d,e,f){console.log("commentsController init"),a.previewLang=navigator.language||navigator.userLanguage,"es"!=a.previewLang&&(a.previewLang="en"),a.words=e.getStrings(),a.comments=[],d.getPost(b.id).then(function(b){console.log(b.data),a.comments=b.data.post.comments}),a.deleteComment=function(a){console.log(a),d.deleteComment(b.id,a.id).then(function(a){console.log(a.data)})}}]);