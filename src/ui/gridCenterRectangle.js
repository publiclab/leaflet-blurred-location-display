module.exports = function changeRectangleColor(options){

function ColorCenterRectangle()
  {
    let locations = options.return_locations_markers_array() ;
    let remote_locations = options.return_SourceUrl_markers_array() ;
    let ctr = 0 ; 
    let bounds = options.blurredLocation.getRectangle().getBounds() ;
    let NE = bounds.getNorthEast() ;
    let SW = bounds.getSouthWest() ;
    for(let i=0 ; i<locations.length ; i++){
      let latitude = locations[i]._latlng.lat ; 
      let longitude = locations[i]._latlng.lng ; 
      if(latitude >= SW.lat && latitude <= NE.lat && longitude >= SW.lng && longitude <= NE.lng){
        ctr++ ;
      }
    }

    for(let i=0 ; i<remote_locations.length ; i++){
      let latitude = remote_locations[i]._latlng.lat ; 
      let longitude = remote_locations[i]._latlng.lng ; 
      if(latitude >= SW.lat && latitude <= NE.lat && longitude >= SW.lng && longitude <= NE.lng){
        ctr++ ;
      }
    }

    let color = '#ff0000' ;
    
    if(ctr === 0){
      color = '#ff0000' ;
    }
    else if(ctr >=1 && ctr<=10){
      color = '#faff05' ;
    }
    else if(ctr<=15){
      color = '#FFA500  ' ;
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

    options.blurredLocation.getRectangle().setStyle({fillColor: color}) ;
    options.blurredLocation.getRectangle().bindPopup('Number of Markers : ' + ctr) ;
  }

  ColorCenterRectangle() ; 

  return ColorCenterRectangle ;
}