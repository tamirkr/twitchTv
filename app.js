/**
 * Created by Tamir on 05/06/2016.
 */
var app = angular.module("app", []);

app.controller("mainCtrl", ["$scope", "$http", function ($scope, $http) {
    var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb",
        "thomasballinger","noobs2ninjas","beohoff","brunofin",
        "comster404","test_channel","cretetion","sheevergaming","TR7K","OgamingSC2","ESL_SC2"];
    $scope.streams = [];
    $scope.streamsDisplay = [];
    $scope.streamsTemp = [];
    $scope.selected = 'all';
    $scope.allClick = function() {
        $scope.selected = 'all';

        $scope.streamsDisplay = $scope.streams.slice(0);
        $scope.streamsTemp = $scope.streamsDisplay.slice(0);
    }

    $scope.onlineClick = function() {
        $scope.selected = 'online';

        $scope.streamsDisplay = $scope.streams.filter(function(stream) {
            return stream.status === 'online';
        });
        $scope.streamsTemp = $scope.streamsDisplay.slice(0);
    }

    $scope.offlineClick = function() {
        $scope.selected = 'offline';

        $scope.streamsDisplay = $scope.streams.filter(function(stream) {
            return stream.status === 'offline';
        });
        $scope.streamsTemp = $scope.streamsDisplay.slice(0);
    }

    $scope.performSearch = function() {
        $scope.streamsDisplay = $scope.streamsTemp.filter(function(stream) {
            return stream.name.match(new RegExp(document.querySelector('#search').value, 'i'));
        });
    }

    // Get stream and channel info for each streamer
    streamers.forEach(function(streamer) {
        $http.jsonp('https://api.twitch.tv/kraken/streams/' + streamer + '?callback=JSON_CALLBACK')
            .success(function(stream) {
                $http.jsonp(stream._links.channel + '?callback=JSON_CALLBACK')
                    .success(function(channel) {
                        // create new object to hold the info that will be used in this app
                        var pushStream = {};

                        // Set status based on whether the stream is online or not
                        if (stream.stream) {
                            pushStream.status = 'online';
                            pushStream.description = channel.status.slice(0,25) + '...';
                        } else {
                            pushStream.status = 'offline';
                        }

                        // Assign channel logo url if there is one. Otherwise use a generic avatar
                        if (channel.logo) {
                            pushStream.logo = channel.logo;
                        } else {
                            pushStream.logo = 'http://static-cdn.jtvnw.net/jtv-static/404_preview-300x300.png';
                        }

                        // Assign other properties to the stream
                        pushStream.id = channel.name;
                        pushStream.name = channel.display_name;
                        pushStream.url = channel.url;

                        // Push the obj into $scope streams arrays
                        $scope.streams.push(pushStream);
                        $scope.streamsDisplay.push(pushStream);
                        $scope.streamsTemp.push(pushStream);
                    });
            });
    });
}])