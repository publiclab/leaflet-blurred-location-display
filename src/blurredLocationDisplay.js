BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options = options || {};
  options.currPrecision = options.currPrecision || 2;
  options.list = options.list || [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]];
  options.currBoxUpperLeft = options.currBoxUpperLeft || [35.35, 39.26];

  options.Interface = options.Interface || require('./ui/Interface.js');
  options.blurredLocation = options.blurredLocation || {};

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

  function exampleMarkers() {

    function marker_display() {
      
      console.log(options.blurredLocation.getPrecision());
      var markers = {
        marker_1: [1.5, 10.7, 0],
        marker_2: [2.5, 9.7, 0],
        marker_3: [4.7, 13.7, 1],
        marker_4: [0.4, 7.7, 1],
        marker_5: [-0.5, 5.7, 2],
        marker_6: [-3.2, 14.4, 2],
        marker_7: [-5.6, 15.7, 3],
        marker_8: [-0.6, 20.6, 3],
      }

      for(marker in markers) {
        L.marker([markers[marker][0], markers[marker][1]]).addTo(options.blurredLocation.map);
      }

    }
    options.blurredLocation.map.on("zoom", marker_display)
  }

  return {
    getBlurredLocations: getBlurredLocations,
    showPopUp: showPopUp,
    Interface: Interface,
    exampleMarkers: exampleMarkers,
  }
}

exports.BlurredLocationDisplay = BlurredLocationDisplay;