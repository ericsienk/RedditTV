/*global angular */

(function (angular) {
    'use strict';

    angular.module("redditTV").factory('videoService', ['$http', function ($http) {
        var factory = {};

        factory.getComments = (function (id) {
            return $http.get( "https://www.reddit.com/r/videos/comments/" + id + ".json")
                .then(function (jsonObj) {
                    var response = [], i;
                    if(jsonObj != null){
                        for (i = 1; i < jsonObj.data[1].data.children.length && i < 60; i++) {
                            if (jsonObj.data[1].data.children[i].kind == "t1") {
                                    response.push(jsonObj.data[1].data.children[i].data.body);
                            }
                        }
                    }
                    return response;
                })
        })

        factory.getVideos = (function (afterID) {
            return $http.get(afterID != null ? "https://www.reddit.com/r/videos/.json?limit=100&after=t3_" + afterID :"https://www.reddit.com/r/videos/.json?limit=100")
                .then(function (jsonObj) {
                    var videos = [], i, type;
                    if (jsonObj != null) {
                        for (i = 0; i < jsonObj.data.data.children.length; i++) {
                            if (jsonObj.data.data.children[i].data.secure_media != null) {
                                type = jsonObj.data.data.children[i].data.domain;
                                videos.push({
                                    ID: jsonObj.data.data.children[i].data.id,
                                    URL: makeURL(jsonObj.data.data.children[i].data.url, type),
                                    TITLE: jsonObj.data.data.children[i].data.title,
                                    TYPE: type,
                                });
                            }
                        }
                    }
                    return videos;
                });

            function makeURL(id, type) {
                var match, url =''
                if (type == 'youtube.com') {
                    match = id.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                    if (match && match[2].length == 11)
                        url = match[2];
                    return "<iframe style='margin-left:auto; margin-right:auto; display:block;' src'//www.youtube.com/embed/" + url + "' width='960' height='500px' frameborder='0' allowfullscreen></iframe>";
                }
                else if (type == 'vimeo.com') {
                    match = id.match(/(videos|video|channels|\.com)\/([\d]+)/);
                    if (match)
                        url = match[2];
                    return "<iframe style='margin-left:auto; margin-right:auto; display:block;' src='//player.vimeo.com/video/" + url + "' width='960' height='500px' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                }
                else {
                    return id;
                }
            }
        })

        return factory;
    }]);
}(angular));
