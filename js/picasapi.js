var picasapi = (function() {


  function Picasapi(url, cb) {


  }

  Picasapi.prototype.getData = function(url, cb, object) {

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
    }).done(function(data) {
      cb(data, object);
    });

  }

  return Picasapi;

}());
