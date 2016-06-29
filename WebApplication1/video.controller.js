'use strict';

var mainApp = angular.module("redditTV", []);
mainApp.controller('redditTVCtrl', function ($scope, videoService, $http) {
    $scope.loading = true;

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
            $scope.$evalAsync(function() {
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

    }

    $scope.prevVideo = function () {
        if ($scope.index > 0) {
            $scope.index--;
            $scope.current = $scope.videos[$scope.index];
            getComments($scope.current.ID);
        }

    }

    getVideos('');
});

mainApp.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);



