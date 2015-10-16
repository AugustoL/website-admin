angular.module('ALapp.controllers').controller('createController',['$scope','$routeParams','$location','userService','sessionService', function($scope,$routeParams,$location,userService,sessionService){
	console.log("createController init");
    $scope.words = sessionService.getStrings();
    $scope.previewLang = $scope.language;
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
    	userService.createPost($scope.postTitleEs,$scope.postTitleEn,$scope.postImage,$scope.postCategories,$scope.postBodyEs.replace(/(?:\r\n|\r|\n)/g, '<br />'),$scope.postBodyEn.replace(/(?:\r\n|\r|\n)/g, '<br />')).then(function(promise){
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
            $('.shortBody').html($scope.postTitleEn.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            $('.longBody').html($scope.postTitleEn.replace(/(?:\r\n|\r|\n)/g, '<br />')); 
        }
    }

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
            var txtToAdd = "<legend><h4>"+$scope.videoName+"</h4></legend><div class='row text-center'><iframe width='420' height='315' src='https://www.youtube.com/embed/"+$scope.videoCode+"'></iframe></div>";
            $scope['postBody'+lang] = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
            $("#bodyInput"+lang).val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
        }
    }

    $scope.toTrusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }
}]);