'use strict';
var mainApp = angular.module("redditTV", []);
mainApp.controller('redditTVCtrl', function ($scope, videoService, $http) {
    $scope.loading = true;
    $scope.talker = '';
    $scope.speechOn = true;
    var recognition;

    var getVideos = function () {
        videoService.getVideos().then(function (data) {
            $scope.$evalAsync(function () {
                $scope.videos = data;
                if ($scope.videos.length > 0) {
                    $scope.loading = false;
                    $scope.current = data[0];
                    getComments($scope.current.ID);
                    $scope.index = 0;
                }
            })
        })
    };
    var getComments = function (id) {
        videoService.getComments(id).then(function (data) {
            $scope.$evalAsync(function () {
                $scope.comments = data;
            })
        })
    };
    $scope.nextVideo = function () {
        if ($scope.index < $scope.videos.length) {
            $scope.index++;
            $scope.current = $scope.videos[$scope.index];
            getComments($scope.current.ID);
        }
        else
            getVideos($scope.current.ID);
    };
    $scope.prevVideo = function () {
        if ($scope.index > 0) {
            $scope.index--;
            $scope.current = $scope.videos[$scope.index];
            getComments($scope.current.ID);
        }
    };
    $scope.key = function($event){
        if ($event.keyCode == 39)
            $scope.nextVideo();
        else if ($event.keyCode == 37)
            $scope.prevVideo();
    };
    var startSpeechListening = function()
    {
        function setupSpeech(){
            try {
                recognition = undefined;
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.start();

            } catch (e) {
                recognition = Object;
            }
        }
        setupSpeech();
        recognition.onresult = function (event) {
            if (event !== undefined) {
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    console.log(event.results[i][0].transcript);
                    if(event.results[i][0].transcript.trim().toUpperCase() === "NEXT") {
                        $scope.nextVideo();
                        recognition.stop();
                        break;
                    }
                }
            }
        };
        recognition.onend = function(){
            //console.log("speech restarted: " + new Date($.now()) + " " + $scope.speechOn);
            if($scope.speechOn) {
                recognition.start();
            }
        };
    };
    $('#toggle-mic').change(function() {
        $scope.speechOn = !$scope.speechOn;
        if($scope.speechOn)
            recognition.start();
        else
            recognition.stop();
    });

    getVideos('');
    startSpeechListening();
});
mainApp.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);
