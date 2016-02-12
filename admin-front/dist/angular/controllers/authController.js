/*
 AugustoLemble 2016-02-12 
*/
angular.module("ALapp.controllers").controller("authController",["$scope","sessionService","$window",function(a,b,c){console.log("authController init"),b.getItem("auth")||$("#authModal").modal("show"),a.auth={username:"",password:""},a.saveAuth=function(){console.log(a.auth.username+":"+a.auth.password),a.auth.username.length>6&&a.auth.password.length>6&&(b.addItem("auth",a.auth.username+":"+a.auth.password),c.location.reload())}}]);