/*
 AugustoLemble 2016-02-12 
*/
angular.module("ALapp.controllers").controller("navBarController",["$scope","sessionService","$window",function(a,b,c){console.log("navBarController init"),a.words=b.getStrings(),a.language=a.words.language,a.backendDomain="http://"+c.location.hostname+":3011",a.changeLang=function(c){a.words=b.getStrings(c),a.language=c}}]);