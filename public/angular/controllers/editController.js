angular.module('ALapp.controllers').controller('editController',['$scope','$routeParams','$location','userService','sessionService','$sce', function($scope,$routeParams,$location,userService,sessionService,$sce){
	console.log("editController init");
    $scope.previewLang = navigator.language || navigator.userLanguage;
    if ($scope.previewLang != "es")
        $scope.previewLang = 'en';
    $scope.words = sessionService.getStrings();
	$scope.postDate = new Date();
    $scope.postCategories = "";
    $scope.postTitleEs = "";
    $scope.postTitleEn = "";
    $scope.postImage = "";
    $scope.postBodyEs = "";
    $scope.postBodyEn = "";
    $scope.validCats = ["Travel","Music","Bitcoin","Linux","Programing","Other","Games","Movies","Series"];
    $scope.catsOk = false;
    $scope.imgSize = 's';

    $scope.$watch('previewLang', function(newValue,oldValue) {
        if ($scope.previewLang == "en"){
            $('.shortBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
            $scope.words = sessionService.getStrings('en');
        } else {
            $('.shortBody').html($scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $scope.words = sessionService.getStrings('es');
        }
    });
    
    if ($routeParams.id){
    	userService.getPost($routeParams.id).then(function(promise){
    		console.log(promise.data);
    		$scope.postDate = promise.data.post.date;
            if (promise.data.post.categories.length > 0){
                $scope.postCategories = promise.data.post.categories[0];
                for (var i = 1; i < promise.data.post.categories.length; i++) {
                    $scope.postCategories = $scope.postCategories+","+promise.data.post.categories[i];
                };
            } else {
                $scope.postCategories = promise.data.post.categories[0];
            }
			$scope.postTitleEs = promise.data.post.titleEs;
            $scope.postTitleEn = promise.data.post.titleEn;
            $scope.postImage = promise.data.post.img;
			$scope.postBodyEs = promise.data.post.bodyEs.replace(/<br\s*\/?>/mg,"\n");
            $scope.postBodyEn = promise.data.post.bodyEn.replace(/<br\s*\/?>/mg,"\n");
            $('.shortBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
    	})
    }

    $scope.$watch('postCategories', function(newValue,oldValue) {
        $scope.catsOk = true;
        if (newValue&&newValue.indexOf(',') > -1)
            angular.forEach(newValue.split(','), function(cat){
                if ($scope.validCats.indexOf(cat) < 0)
                    $scope.catsOk = false;  
            })
        else
            if ($scope.validCats.indexOf(newValue) < 0)
                $scope.catsOk = false;  
        console.log($scope.catsOk);
    });

    $scope.$watch('catsOk', function(newValue,oldValue) {
        if (newValue)
            $("#editButton").prop('disabled', false);
        else
            $("#editButton").prop('disabled', true);
    });

    $scope.triggerPreview = function(preview){
        console.log(preview);
        if (preview == 'short'){
            if ($("#shortPreview").is(":visible"))
                $("#shortPreview").hide();
            else
                $("#shortPreview").show();  
        } else if (preview = 'long'){
            if ($("#longPreview").is(":visible"))
                $("#longPreview").hide();
            else
                $("#longPreview").show()
        }
    }

    $("#editButton").on('click', function(){
    	userService.editPost($scope.postTitleEs,$scope.postTitleEn,$scope.postImage,$scope.postCategories,$scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />'),$scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />'),$routeParams.id).then(function(promise){
    		console.log(promise.data);
            if (promise.data.success){
                $location.path('/admin');
            }
    	})
    });

    $scope.updateBody = function(){
        if ($scope.previewLang == "es"){
            $('.shortBody').html($scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
        } else {
            $('.shortBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
        }
    };

    $scope.addImg = function(lang){
        console.log($scope.imgSize);
        console.log($scope.imgName);
        if (($scope.imgSize == 's' ||$scope.imgSize == 'm' || $scope.imgSize == 'l' ||$scope.imgSize == 'xl') && ($scope.imgName.length > 0) ){
            var caretPos = document.getElementById("bodyInput"+lang).selectionStart;
            var textAreaTxt = jQuery("#bodyInput"+lang).val();
            var txtToAdd = "<div class='img img-"+$scope.imgSize+"'><img src='/getImage?name="+$scope.imgName+"'></div>";
            $scope['postBody'+lang] = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
            $("#bodyInput"+lang).val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
        }   
    }

    $scope.addVideo = function(lang){
        console.log($scope.videoName);
        console.log($scope.videoCode);
        if ($scope.videoCode.length > 0){
            var caretPos = document.getElementById("bodyInput"+lang).selectionStart;
            var textAreaTxt = jQuery("#bodyInput"+lang).val();
            var txtToAdd = "<legend><h4 class='text-center'>"+$scope.videoName+"</h4></legend><div class='row text-center'><iframe width='420' height='315' src='https://www.youtube.com/embed/"+$scope.videoCode+"'></iframe></div>";
            $scope['postBody'+lang] = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
            $("#bodyInput"+lang).val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
        }
    }

    $scope.toTrusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }
}]);