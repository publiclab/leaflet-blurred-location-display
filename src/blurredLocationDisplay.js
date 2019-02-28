BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
 
  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};

  options.locations = options.locations || [] ;
  options.source_url = options.source_url || "" ;
  options.JSONparser = options.JSONparser || defaultJSONparser ;

  let map = options.blurredLocation.map ;
  var InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.blurredLocation = options.blurredLocation;
  var Interface = options.Interface(InterfaceOptions);

  require('./ui/iconColors.js') ;

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

  function IconColor(precision){
    if(precision === 0){
       return new L.Icon.BlueIcon() ;
    }
    else if(precision === 1){
      return new L.Icon.RedIcon() ;
    }
    else if(precision === 2){
      return new L.Icon.OrangeIcon() ;
    }
    else if(precision === 3){
      return new L.Icon.GreenIcon() ;
    }
    else if(precision === 4){
      return new L.Icon.BlackIcon() ;
    }
    else if(precision === 5){
      return new L.Icon.GreyIcon() ;
    }
    return new L.Icon.YellowIcon() ;
  }
  
  function fetchLocationData(isOn) {
    if(isOn === true) {
      for(i=0 ; i < options.locations.length ; i++){
        var latitude = options.locations[i][0] ; 
        var longitude = options.locations[i][1] ; 
        if(filterCoordinate(latitude , longitude)){
              afterDecimal = latitude.toString().split(".")[1] ;
              precision = 0 ; 
              if(typeof afterDecimal !== "undefined") {
                precision = afterDecimal.length ;
              }
              var icon_color = IconColor(precision) ;
              var m = L.marker([latitude, longitude] , {icon: icon_color}) ;
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
              var obj = parsed_data[i] ;
              var id = obj["id"] ;
              var url = obj["url"] ;
              var latitude = obj["latitude"] ;
              var longitude = obj["longitude"] ;
              var title = obj["title"] ;

              if(filterCoordinate(latitude , longitude)){
                afterDecimal = latitude.toString().split(".")[1] ;
                precision = 0 ; 
                if(typeof afterDecimal !== "undefined") {
                  precision = afterDecimal.length ;
                }
                
                var icon_color = IconColor(precision) ;
                var m = L.marker([latitude,longitude], {
                  icon: icon_color
                }) ;
                m.addTo(map).bindPopup("<a href=" + url + ">" + title + "</a> <br> Precision : " + precision) ;
                SourceUrl_markers_array[SourceUrl_markers_array.length] = m ;  
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
  
  function getMarkersOfPrecision(precision){
    var locations_markers = return_locations_markers_array() ;
    var sourceurl_markers = return_SourceUrl_markers_array() ; 

    var filtered_locations_markers = [] ;
    var filtered_sourceurl_markers = [] ;

    for(i=0 ; i < locations_markers.length ; i++){
      let after_decimal = locations_markers[i]._latlng.lat.toString().split(".")[1] ;
      let precision_of_marker = 0 ; 
      if(typeof after_decimal !== "undefined") {
          precision_of_marker = after_decimal.length ;
      }
      if(precision_of_marker === precision){
        filtered_locations_markers[filtered_locations_markers.length] = locations_markers[i] ; 
      }
    }

    for(i=0 ; i < sourceurl_markers.length ; i++){
      let after_decimal = sourceurl_markers[i]._latlng.lat.toString().split(".")[1] ;
      let precision_of_marker = 0 ; 
      if(typeof after_decimal !== "undefined") {
          precision_of_marker = after_decimal.length ;
      }
      if(precision_of_marker === precision){
        filtered_sourceurl_markers[filtered_sourceurl_markers.length] = sourceurl_markers[i] ; 
      }
    }

    return {
      filtered_locations_markers: filtered_locations_markers,
      filtered_sourceurl_markers: filtered_sourceurl_markers
    }
  }

  function filterCoordinatesToPrecison(precision)
  {
    let locations = options.locations ; 
    let filtered_locations = [] ; 

    for(let i=0 ; i < locations.length ; i++){
      let after_decimal = locations[i][0].toString().split(".")[1] ;
      let precision_of_coordinate = 0 ; 
      if(typeof after_decimal !== "undefined") {
          precision_of_coordinate = after_decimal.length ;
      }
      if(precision_of_coordinate === precision){
        filtered_locations[filtered_locations.length] = locations[i] ; 
      }  
    }
    return filtered_locations ;
  }

  return {
    locations_markers_array: return_locations_markers_array ,
    SourceUrl_markers_array: return_SourceUrl_markers_array,
    removeAllMarkers: removeAllMarkers,
    Interface: Interface,
    getMarkersOfPrecision: getMarkersOfPrecision, 
    filterCoordinatesToPrecison: filterCoordinatesToPrecison
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;