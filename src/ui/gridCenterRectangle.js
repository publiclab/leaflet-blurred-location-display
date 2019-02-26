module.exports = function changeRectangleColor(options){

 var map = options.blurredLocation.map ;  
 var rectangles = [] ; 

 function getColorCode(ctr){
    let color = '#ff0000' ;
    if(ctr === 0){
      color = '#F3F0C0' ;
    }
    else if(ctr >=1 && ctr<=10){
      color = '#FFA500' ;
    }
    else if(ctr<=15){
      color = '#faff05' ;
    }
    else if(ctr<=25){
      color = '#FF6347' ; 
    }
    else if(ctr<=35){
      color = '#FF4500' ;
    }
    else if(ctr<=45){
      color = '#FF0000' ;
    }
    else{
      color = '#8B0000' ;
    }
    return color ; 
 }

 function ColorRectangles()
  { 
      if(typeof options.blurredLocation.getRectangle() !== "undefined"){
        options.blurredLocation.getRectangle().remove() ; 
      }
      for(let i=0 ; i<rectangles.length ; i++){
        rectangles[i].remove() ; 
      }
      rectangles.length = 0 ;
      rectangles = [] ;
    if(map.getZoom() >= 3 && map.getZoom() <=9){
      drawFullHeatMap() ;
    } 
  }

  ColorRectangles() ; 

  function calculateMarkersInsideRect(bounds)
  {
    let locations = options.return_locations_markers_array() ;
    let remote_locations = options.return_SourceUrl_markers_array() ;
    let ctr = 0 ; 

    for(let i=0 ; i<locations.length ; i++){
      let latitude = locations[i]._latlng.lat ; 
      let longitude = locations[i]._latlng.lng ; 
      if(latitude >= bounds[0][0] && latitude <= bounds[1][0] && longitude >= bounds[0][1] && longitude <= bounds[1][1]){
        ctr++ ;
      }
    }

    for(let i=0 ; i<remote_locations.length ; i++){
      let latitude = remote_locations[i]._latlng.lat ; 
      let longitude = remote_locations[i]._latlng.lng ; 
      if(latitude >= bounds[0][0] && latitude <= bounds[1][0] && longitude >= bounds[0][1] && longitude <= bounds[1][1]){
        ctr++ ;
      }
    }
    return ctr ;
  }

  // generated left row of rectangles starting from current_lng to left_lng !
  function leftRectangles(left_lng , current_lng , upper_lat , lower_lat , diff)
  {
    while(current_lng+diff >= left_lng){
      let lat1 = lower_lat ; 
      let lng1 = current_lng ; 

      let lat2 = upper_lat ; 
      let lng2 = current_lng + diff ;

      let bounds = [[lat1,lng1], [lat2,lng2]] ;
      let ctr = calculateMarkersInsideRect(bounds) ; 
      let color = getColorCode(ctr) ;

      let r = L.rectangle(bounds, {color: color , weight: 1}).bindPopup('Number of Markers : ' + ctr).addTo(map);
      rectangles[rectangles.length] = r ; 
      
      current_lng = current_lng - diff ; 
     }
  }

  // generated left row of rectangles starting from current_lng to left_lng !
  function rightRectangles(right_lng , current_lng , upper_lat , lower_lat , diff)
  {
    while(current_lng-diff <= right_lng){
      let lat1 = lower_lat ; 
      let lng1 = current_lng ; 

      let lat2 = upper_lat ; 
      let lng2 = current_lng + diff ;

      let bounds = [[lat1,lng1], [lat2,lng2]] ;
      let ctr = calculateMarkersInsideRect(bounds) ; 
      let color = getColorCode(ctr) ;

      let r = L.rectangle(bounds, {color: color , weight: 1}).bindPopup('Number of Markers : ' + ctr).addTo(map);
      rectangles[rectangles.length] = r ; 
      
      current_lng = current_lng + diff ; 
     }
  }

  function drawFullHeatMap()
  {
     
     let center_bounds = options.blurredLocation.getRectangle().getBounds() ;
    
     let center_NE = center_bounds.getNorthEast() ;
     let center_SW = center_bounds.getSouthWest() ;
     
     let diff = center_NE.lat - center_SW.lat ; 
    
     let current_SW_lng = center_SW.lng ; 

     let current_upper_lat = center_SW.lat ; 
     while(current_upper_lat <= map.getBounds().getNorthEast().lng){

      current_SW_lng = center_SW.lng ; 
      leftRectangles(map.getBounds().getSouthWest().lng , current_SW_lng , current_upper_lat + diff , current_upper_lat, diff) ;
      rightRectangles(map.getBounds().getNorthEast().lng , current_SW_lng+diff , current_upper_lat + diff , current_upper_lat , diff) ;
      
      current_upper_lat = current_upper_lat + diff ; 
     }

     current_upper_lat = center_SW.lat - diff ; 
     while(current_upper_lat + diff >= map.getBounds().getSouthWest().lat){


      current_SW_lng = center_SW.lng ; 
      leftRectangles(map.getBounds().getSouthWest().lng , current_SW_lng , current_upper_lat + diff , current_upper_lat, diff) ;
      rightRectangles(map.getBounds().getNorthEast().lng , current_SW_lng + diff , current_upper_lat + diff , current_upper_lat , diff) ;
      
      current_upper_lat = current_upper_lat - diff ; 
     }

  }

  return ColorRectangles ;
}