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
        var NWlat = options.blurredLocation.map.getBounds().getNorthWest().lat ;
        var NWlng = options.blurredLocation.map.getBounds().getNorthWest().lng ;
        var SElat = options.blurredLocation.map.getBounds().getSouthEast().lat ;
        var SElng = options.blurredLocation.map.getBounds().getSouthEast().lng ;
        people_url = "https://publiclab.org/api/srch/nearbyPeople?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ;

        $.getJSON("people_url" , function(data) {
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