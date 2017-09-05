leaflet-blurred-location-display
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location-display.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location-display)



**This is a working draft; the project will be working towards an initial v0.0.1 release in coming weeks**

leaflet-blurred-location-display is an extension of leaflet-blurred-location and does the following:

* Cleverly dispays your location, keeping your privacy settings in mind

## Setting up leaflet-blurred-location-display

To set up the library first clone this repo to your local after that run 'npm install' to install all the neccessary packages required.


## Options

### Basic

| Option         | Use                | Usage (Default)                  |
|----------------|--------------------|----------------------------------|
| currPrecision       |To set the current precision for extraction from the map|`options.currPrecision = 2`|
|list (testing)            |To input all the locations saved on the map along with a pop up text|`options.locations = [[35.3, 39.2, "Popup Text"],[35.3554, 39.2623, "Popup Text"]]`|
|currBoxUpperLeft           |To set location of upper left corner of selected square|`options.currBoxUpperLeft = [35.35, 39.26]`|


## API

| Methods         | Use                | Usage (Example)|
|-----------------|--------------------|----------------|
|`getBlurredLocations()`       | Used to get the locations fit to display according to given map parameters.|  `blurredLocationDisplay.getBlurredLocations() //This would return the list of all locations fit to display`|
|`showPopUp()`       | Used to show a pop up for all the locations fit to be displayed. The pop up text will be mentioned in the input itself|`blurredLocationDisplay.showPopUp() //This would show pop ups of all locations fit to display`|


## Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
| **'Blurred' location display** | Your exact location won't be posted, only the grid square it falls within will be shown till the level of precision you have set to your location.|
| **'Blurred' human-readable location display** | The name of the location you added will be displayed till the level of precision you set as the extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc. |
