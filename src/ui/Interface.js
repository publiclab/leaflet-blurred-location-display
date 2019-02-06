module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';

    options.blurredLocation = options.blurredLocation;
  
  /* This is taken automatically by "moveend" listenner ! */
  
  //   function getLocationWhenInputChanges() {
  //     var lat = document.getElementById(options.latId);
  //     var lng = document.getElementById(options.lngId);

  //     function addMarker() {

  //       var latitude = options.blurredLocation.getLat();
  //       var longitude = options.blurredLocation.getLon();
  //       var NWlat = options.blurredLocation.map.getBounds().getNorthWest().lat ;
  //       var NWlng = options.blurredLocation.map.getBounds().getNorthWest().lng ;
  //       var SElat = options.blurredLocation.map.getBounds().getSouthEast().lat ;
  //       var SElng = options.blurredLocation.map.getBounds().getSouthEast().lng ;
  //       people_url = "https://publiclab.org/api/srch/nearbyPeople?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ;

  //       $.getJSON(people_url , function(data) {
  //       	   if (!!data.items) {
  //              for (i = 0; i < data.items.length; i++) {
  //                  var mid = data.items[i].doc_id ;
  //                  var url = data.items[i].doc_url;
  //                  var latitude = data.items[i].latitude ;
  //                  var longitude = data.items[i].longitude ;
  //                  var title = data.items[i].doc_title;
  //                  var m = L.marker([data.items[i].latitude, data.items[i].longitude], {
  //                      title: title
  //                  }) ;
  //                  if(filterCoordinate(latitude , longitude)){
  //                     m.addTo(options.blurredLocation.map).bindPopup("<a href=" + url + ">" + title + "</a>") ;
  //                     markers_array[markers_array.length] = m ;  
  //                  }
  //                  //layerGroup.addLayer(m) ;
  //              }
  //          }
  //       });
  //     }

	 //    $(lat).change(addMarker);
  //  	  $(lng).change(addMarker);
  // 	}

  // //getLocationWhenInputChanges();

  return {
   // getLocationWhenInputChanges: getLocationWhenInputChanges,
  }
}