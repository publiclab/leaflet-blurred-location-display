BlurredLocationDisplay = function BlurredLocationDisplay(options) {

  options.currPrecision = options.currPrecision || 2;
  options.list = options.list || [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]];
  options.currBoxUpperLeft = options.currBoxUpperLeft || [35.30, 39.20];


  function getBlurredLocations() {

    blurredLocations = [];

    for(i in options.list) {
      if(i.split('.')[1].length >= options.currPrecision) {
        if(i[0] >= options.currBoxUpperLeft[0] && i[0] <= options.currBoxUpperLeft[0] + 10**(-1*options.currPrecision) && i[1] >= options.currBoxUpperLeft[1] && i[1] <= options.currBoxUpperLeft[1] + 10**(-1*options.currPrecision) ) {
        blurredLocations[blurredLocations.length] = i;
        }
      }
    }
  }

  function showPopUp() {
    blurredLocations = getBlurredLocations();
    for(i in blurredLocations) {
      alert(i[2]);
    }
  }

  return {
    getBlurredLocations: getBlurredLocations,
    showPopUp: showPopUp,
  }
}
