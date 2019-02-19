BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
  options.currPrecision = options.currPrecision || 2;
  options.list = options.list || [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]];
  options.currBoxUpperLeft = options.currBoxUpperLeft || [35.35, 39.26];

  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};
  options.PLpeopleAPI = options.PLpeopleAPI || false ;
  options.locations = options.locations || [] ;
  map = options.blurredLocation.map ;
  var InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.blurredLocation = options.blurredLocation;
  var Interface = options.Interface(InterfaceOptions);

  L.Icon.BlackIcon = L.Icon.extend({
      options: {
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }
   });


  function getBlurredLocations() {

    blurredLocations = [];
    afterDecimal = 0

    for(i in options.list) {
      lat = options.list[i][0]
      afterDecimal = lat.toString().split(".")[1]
      if(afterDecimal.length >= options.currPrecision) {
        if(options.list[i][0] >= options.currBoxUpperLeft[0] && options.list[i][0] <= options.currBoxUpperLeft[0] + 10**(-1*options.currPrecision) && options.list[i][1] >= options.currBoxUpperLeft[1] && options.list[i][1] <= options.currBoxUpperLeft[1] + 10**(-1*options.currPrecision) ) {
        blurredLocations[blurredLocations.length] = options.list[i];
        }
      }
    }
    return blurredLocations;
  }

  function showPopUp() {
    blurredLocations = getBlurredLocations();
    for(i in blurredLocations) {
      alert(blurredLocations[i][2]);
    }
    return blurredLocations;
  }

  function filterCoordinate(lat , lng) {

      current_zoom = map.getZoom() ;

      if(current_zoom >= 0 && current_zoom <=5){
        // Show all markers 
        return true ; 
      }
      else if(current_zoom >= 6 && current_zoom <=7){
        // remove <= 1  precision level coordinates
         afterDecimal = lat.toString().split(".")[1] ;
         if(typeof afterDecimal !== "undefined" && afterDecimal.length > 1) {
          return true ;
         }
      }
      else if(current_zoom >= 8 && current_zoom <=10){
        // remove <= 3 precision level coordinates
         afterDecimal = lat.toString().split(".")[1] ;
         if(typeof afterDecimal !== "undefined" && afterDecimal.length > 3) {
          return true ;
         }
      }
      else if(current_zoom >= 11 ){
        // remove <= 4 precision level coordinates
         afterDecimal = lat.toString().split(".")[1] ;
         if(typeof afterDecimal !== "undefined" && afterDecimal.length > 4) {
           return true ;
         }
      }
      
      return false ;
  }

  var PLmarkers_array = [] ;
  var locations_markers_array = [] ;

  function removeAllMarkers(markers_array) {
    for(i in markers_array){
      map.removeLayer(markers_array[i]) ;
    }
    markers_array = [] ;
    markers_array.length = 0 ; 
    console.log("Removed all markers !") ;
    return markers_array ; 
  }

  function fetchPeopleData(isOn) {
    if(isOn === true)
    {
      var NWlat = map.getBounds().getNorthWest().lat ;
      var NWlng = map.getBounds().getNorthWest().lng ;
      var SElat = map.getBounds().getSouthEast().lat ;
      var SElng = map.getBounds().getSouthEast().lng ;

      people_url = "https://publiclab.org/api/srch/nearbyPeople?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ; 
       
      $.getJSON(people_url , function (data) {
        if (!!data.items) {
          for (i = 0; i < data.items.length; i++) {
            var mid = data.items[i].doc_id ;
            var url = data.items[i].doc_url;
            var latitude = data.items[i].latitude ;
            var longitude = data.items[i].longitude ;
            var title = data.items[i].doc_title;
            var m = L.marker([data.items[i].latitude, data.items[i].longitude], {
                  title: title
            }) ;
            if(filterCoordinate(latitude , longitude)){
              afterDecimal = latitude.toString().split(".")[1] ;
              precision = 0 ; 
              if(typeof afterDecimal !== "undefined") {
                precision = afterDecimal.length ;
              }
              m.addTo(map).bindPopup("<a href=" + url + ">" + title + "</a> <br> Precision : " + precision) ;
              PLmarkers_array[PLmarkers_array.length] = m ;  
            }

          }
        }
      });
    }
  }

  function fetchLocationData(isOn) {
    if(isOn === true){
      for(i=0 ; i < options.locations.length ; i++){
        var latitude = options.locations[i][0] ; 
        var longitude = options.locations[i][1] ; 
        var BlackIcon = new L.Icon.BlackIcon() ;
        if(filterCoordinate(latitude , longitude)){
              afterDecimal = latitude.toString().split(".")[1] ;
              precision = 0 ; 
              if(typeof afterDecimal !== "undefined") {
                precision = afterDecimal.length ;
              }
              var m = L.marker([latitude, longitude] , {icon: BlackIcon}) ;
              m.addTo(map).bindPopup("Precision : " + precision) ;
              locations_markers_array[locations_markers_array.length] = m ;
        }
      } 
    }
  }

  function fetchPLpeopleAPI() {
    map.on('zoomend' , function () {
      // clear all markers 
      PLmarkers_array = removeAllMarkers(PLmarkers_array) ;
      //we can add more API's in similar way by passing boolean value in options from API .
      fetchPeopleData(options.PLpeopleAPI) ; 
      }) ;

      map.on('moveend' , function () {
        // clear all markers 
        PLmarkers_array = removeAllMarkers(PLmarkers_array) ;
        fetchPeopleData(options.PLpeopleAPI) ; 
      }) ;
  }

  if(options.PLpeopleAPI){
    fetchPLpeopleAPI() ;
  }

  function activateParameter_locations() {
    map.on('zoomend' , function () {
      // clear all markers 
      locations_markers_array = removeAllMarkers(locations_markers_array) ;
      fetchLocationData(true) ; 
    }) ;

    map.on('moveend' , function () {
      // clear all markers 
      locations_markers_array = removeAllMarkers(locations_markers_array) ;
      fetchLocationData(true) ; 
    }) ;
  }

  if(options.locations.length !== 0) {
      activateParameter_locations() ;
  }

  return {
    removeAllMarkers: removeAllMarkers,
    getBlurredLocations: getBlurredLocations,
    showPopUp: showPopUp,
    Interface: Interface,
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;