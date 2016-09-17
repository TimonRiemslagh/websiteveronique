var albums = [];
var apiCaller = new picasapi();
var sliderphotosnumber = 3;

angular.module('myApp', [])
.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})
.controller('mainController', function($scope) {

  var setTheSlider = function(album) {
    $scope.sliderphotos = [];
    for(var t = 0; t < sliderphotosnumber; t++) {
      $scope.$apply(function() {
        $scope.sliderphotos.push(album.photos[t].photo);
      });
    }

    console.log('test');

    $('.js-unslider').unslider();
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
  };

  var handleAlbums = function(data) {
    data.feed.entry.forEach(function(entry) {
      if(entry.title.$t.substr(0,2) === "vc") {
        var album = {title: entry.title.$t, summary: entry.summary.$t, link: entry.link[0].href};
        albums.push(album);
        apiCaller.getData(album.link, handlePhotos, album);
      }
    });
  }

  apiCaller.getData('https://picasaweb.google.com/data/feed/api/user/krisrpr?alt=json', handleAlbums);

});
