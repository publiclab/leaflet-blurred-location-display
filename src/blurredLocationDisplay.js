BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
  options.currPrecision = options.currPrecision || 2;
  options.list = options.list || [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]];
  options.currBoxUpperLeft = options.currBoxUpperLeft || [35.35, 39.26];

  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};

  options.locations = options.locations || [] ;
  options.source_url = options.source_url || "" ;
  options.JSONparser = options.JSONparser || defaultJSONparser ;

  let map = options.blurredLocation.map ;
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

   L.Icon.RedIcon = L.Icon.extend({
      options: {
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

  function defaultJSONparser(data)
  {
      parsed_data = [] ; 
      if (!!data.items) {
        for (i = 0 ; i < data.items.length ; i++) {
          let obj = {} ;
          obj["id"] = data.items[i].doc_id ;
          obj["url"] = data.items[i].doc_url;
          obj["latitude"] = data.items[i].latitude ;
          obj["longitude"] = data.items[i].longitude ;
          obj["title"] = data.items[i].doc_title ;
          parsed_data[parsed_data.length] = obj ;
        }
      }
      return parsed_data ;   
  }

  var locations_markers_array = [] ;
  var SourceUrl_markers_array = [] ;
  var SourceUrl_id_map = new Map() ; 

  function removeAllMarkers(markers_array) {
    for(i in markers_array){
      map.removeLayer(markers_array[i]) ;
    }
    markers_array = [] ;
    markers_array.length = 0 ; 
    SourceUrl_id_map.clear() ;
    return markers_array ; 
  }

  
  function fetchLocationData(isOn) {
    if(isOn === true) {
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

  function fetchSourceUrlData(isOn) {
    if(isOn === true) {
      var NWlat = map.getBounds().getNorthWest().lat ;
      var NWlng = map.getBounds().getNorthWest().lng ;
      var SElat = map.getBounds().getSouthEast().lat ;
      var SElng = map.getBounds().getSouthEast().lng ;

      source_url = options.source_url + "?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ; 

      $.getJSON(source_url , function (data) {
            
            var parsed_data = options.JSONparser(data) ;  // JSONparser defined by user used here !
            
            for(i=0 ; i<parsed_data.length ; i++){
              var RedIcon = new L.Icon.RedIcon() ;
              var obj = parsed_data[i] ;
              var id = obj["id"] ;
              var url = obj["url"] ;
              var latitude = obj["latitude"] ;
              var longitude = obj["longitude"] ;
              var title = obj["title"] ;
              var m = L.marker([latitude,longitude], {
                  icon: RedIcon
              }) ;

              if(filterCoordinate(latitude , longitude)){
                afterDecimal = latitude.toString().split(".")[1] ;
                precision = 0 ; 
                if(typeof afterDecimal !== "undefined") {
                  precision = afterDecimal.length ;
                }
                if(SourceUrl_id_map.has(id) === false){
                  m.addTo(map).bindPopup("<a href=" + url + ">" + title + "</a> <br> Precision : " + precision) ;
                  SourceUrl_markers_array[SourceUrl_markers_array.length] = m ;  
                  SourceUrl_id_map.set(id, true) ;
                }
                
              }  
            }
            ColorRectangles() ;
      });  
    }
  }

  function return_locations_markers_array(){
    return locations_markers_array ; 
  }

  function return_SourceUrl_markers_array(){
    return SourceUrl_markers_array ; 
  }

  function activate_listeners(return_markers_array , fetchData)
  {
    map.on('zoomend' , function () {
      let markers_array = return_markers_array() ;
      let m_array = markers_array ;
      markers_array = removeAllMarkers(markers_array) ;
      m_array.length = 0 ;
      fetchData(true) ; 
      ColorRectangles() ;
    }) ;

    map.on('moveend' , function () {
      let markers_array = return_markers_array() ;
      let m_array = markers_array ;
      markers_array = removeAllMarkers(markers_array) ;
      m_array.length = 0 ;
      fetchData(true) ; 
      ColorRectangles() ;
    }) ;
  }

  if(options.locations.length !== 0) {
    activate_listeners(return_locations_markers_array , fetchLocationData) ; 
  }

  if(options.source_url !== "") {
     activate_listeners(return_SourceUrl_markers_array , fetchSourceUrlData) ; 
  }

  let rectangle_options = {
    return_locations_markers_array: return_locations_markers_array,
    return_SourceUrl_markers_array: return_SourceUrl_markers_array,
    blurredLocation: options.blurredLocation
  }
  options.gridCenterRectangle = require('./ui/gridCenterRectangle.js') ;
  ColorRectangles = options.gridCenterRectangle(rectangle_options) ;
  
  return {
    return_locations_markers_array: return_locations_markers_array ,
    return_SourceUrl_markers_array: return_SourceUrl_markers_array,
    removeAllMarkers: removeAllMarkers,
    getBlurredLocations: getBlurredLocations,
    showPopUp: showPopUp,
    Interface: Interface,
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;