BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
  options.currPrecision = options.currPrecision || 2;
  options.list = options.list || [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]];
  options.currBoxUpperLeft = options.currBoxUpperLeft || [35.35, 39.26];

  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};
  map = options.blurredLocation.map ;
  var InterfaceOptions = options.InterfaceOptions || {};
  InterfaceOptions.blurredLocation = options.blurredLocation;
  var Interface = options.Interface(InterfaceOptions);



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

      if(current_zoom >= 0 && current_zoom <=2){
        // Show all markers 
        return true ; 
      }
      else if(current_zoom >= 3 && current_zoom <=4){
        // remove <= 1  precision level coordinates
         afterDecimal = lat.toString().split(".")[1].length ;
         if(afterDecimal > 1) {
          return true ;
         }
      }
      else if(current_zoom >= 5 && current_zoom <=7){
        // remove <= 3 precision level coordinates
         afterDecimal = lat.toString().split(".")[1].length ;
         if(afterDecimal > 3) {
          return true ;
         }
      }
      else if(current_zoom >= 8 ){
        // remove <= 4 precision level coordinates
         afterDecimal = lat.toString().split(".")[1].length ;
         if(afterDecimal > 4) {
           return true ;
         }
      }
      
      return false ;
  }

    var markers_array = [] ;

    function removeAllMarkers()
    {
      for(i in markers_array){
         map.removeLayer(i) ;
       }
       markers_array.length = 0 ; 
    }

    function fetchPeopleData(isOn)
    {
      if(isOn === true)
      {

       var NWlat = map.getBounds().getNorthWest().lat ;
       var NWlng = map.getBounds().getNorthWest().lng ;
       var SElat = map.getBounds().getSouthEast().lat ;
       var SElng = map.getBounds().getSouthEast().lng ;

       people_url = "https://publiclab.org/api/srch/nearbyPeople?nwlat=" + NWlat + "&selat=" + SElat + "&nwlng=" + NWlng + "&selng=" + SElng ; 
       
       $.getJSON(people_url , function (data) {
           //var layerGroup = L.layerGroup() ;

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
                      m.addTo(map).bindPopup("<a href=" + url + ">" + title + "</a>") ;
                      markers_array[markers_array.length] = m ;  
                   }
                   //layerGroup.addLayer(m) ;
               }
           }

       });
      }
    }

    map.on('zoomend' , function () {
       // clear all markers 
       removeAllMarkers() ;

       //we can add more API's in similar way by passing boolean value in options from API .
       fetchPeopleData(true) ; 

   }) ;

    map.on('moveend' , function () {
       // clear all markers 
       removeAllMarkers() ;
       fetchPeopleData(true) ; 
   }) ;



  return {
    getBlurredLocations: getBlurredLocations,
    showPopUp: showPopUp,
    Interface: Interface,
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;