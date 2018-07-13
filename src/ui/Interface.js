module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';

    options.blurredLocation = options.blurredLocation;

    function getLocationWhenInputChanges() {
      var lat = document.getElementById(options.latId);
      var lng = document.getElementById(options.lngId);

      function addMarker() {

        var latitude = options.blurredLocation.getLat();
        var longitude = options.blurredLocation.getLon();

        $.getJSON("https://publiclab.org/api/srch/taglocations?srchString="+latitude.toString()+","+longitude.toString(), function(data) {
        	for(item in data.items) {
            var lat = data.items[item]['latitude'];
            var lng = data.items[item]['longitude'];
            var url = data.items[item]['docUrl'];

            L.marker([lat, lng]).addTo(options.blurredLocation.map);
            console.log(lat);
            console.log(lng);
          }
        });
      }

	    $(lat).change(addMarker);
   	  $(lng).change(addMarker);
  	}

  getLocationWhenInputChanges();

  return {
    getLocationWhenInputChanges: getLocationWhenInputChanges,
  }
}