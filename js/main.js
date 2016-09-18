var apiCaller = new picasapi();
var sliderphotosnumber = 3;

angular.module('myApp', [])
.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})
.controller('mainController', function($scope) {

  $scope.albums = [];

  var setTheSlider = function(album) {
    $scope.sliderphotos = [];
    for(var t = 0; t < sliderphotosnumber; t++) {
      $scope.$apply(function() {
        $scope.sliderphotos.push(album.photos[t].photo);
      });
    }

    $('.js-unslider').unslider();
  };

  var setEvent = function(object) {
    $scope.upcomming = {};
    $scope.$apply(function() {
      $scope.upcomming.photo = object.photos[0].photo;
      $scope.upcomming.desc = JSON.parse(object.photos[0].description);
      var test = JSON.parse(object.photos[0].description);
    });
  };

  var handleGrid = function() {
    $scope.albumSubSets = [];
    var subsets = Math.floor($scope.albums.length/4);
    var subsetsrest = $scope.albums.length % 4;

    for(var t = 0; t < subsets; t++) {
      var albumSubSet = $scope.albums.slice((t*4), (t*4)+4);
      $scope.$apply(function() {
        $scope.albumSubSets.push(albumSubSet);
      });
    }

    var finalSubSet = $scope.albums.slice($scope.albums.length - subsetsrest, $scope.albums.length);
    $scope.$apply(function() {
      $scope.albumSubSets.push(finalSubSet);
    });

    console.log($scope.albums);
  }

  var handlePhotos = function(data, object) {
    var phs = [];
    data.feed.entry.forEach(function(entry) {
        phs.push({'photo': entry.content.src, 'description': entry.summary.$t});
    });
    object.photos = phs;
    if(object.title == "vcSlideShow") {
      setTheSlider(object);
    }

    if(object.title == "vcEvents") {
      setEvent(object);
    }

    handleGrid();
  };

  var handleAlbums = function(data) {
    data.feed.entry.forEach(function(entry) {

      if(entry.title.$t.substr(0,2) === "vc") {
        var summaryObj = "";
        if(entry.summary.$t) {
          summaryObj = JSON.parse(entry.summary.$t);
        }

        var album = {title: entry.title.$t, summary: summaryObj, link: entry.link[0].href};

        if(album.title !== 'vcEvents' && album.title !== 'vcSlideShow') {
          $scope.albums.push(album);
        }

        apiCaller.getData(album.link, handlePhotos, album);
      }
    });

  };

  apiCaller.getData('https://picasaweb.google.com/data/feed/api/user/krisrpr?alt=json', handleAlbums);

});
