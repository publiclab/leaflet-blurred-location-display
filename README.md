leaflet-blurred-location-display (LBLD)
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location-display.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location-display)


leaflet-blurred-location-display is an extension of leaflet-blurred-location and does the following:

* Cleverly dispays your location, keeping your privacy settings in mind.
* Color code the markers on the map according to the precision.
* Fetches data from remote API or you may pass array of coordinates directly into LBLD API (see example below)

## Demo

1. See how markers are filtered at different zoom levels : 
https://publiclab.github.io/leaflet-blurred-location-display/examples/example.html

2. See how markers are fetched from remote/external API : 
https://publiclab.github.io/leaflet-blurred-location-display/examples/index.html

| Precision  |  Color of marker  |
|------------|-------------------|
|	0		 |		Blue		 |
|	1		 |		Red			 |
|	2		 |		Orange		 |
|	3		 |		Green		 |
|	4		 |		Black	     |
|   5        |      Grey    	 |
|   >=6      |      Yellow   	 |

## Setting up leaflet-blurred-location-display

To set up the library first clone this repo to your local after that run 'npm install' to install all the neccessary packages required.


## Some terms used

* LBLD = leaflet-blurred-location-display .
* LBL = leaflet-blurred-location
* remote markers = markers made from external API .
* local markers = markers made from static data provided directly into LBLD API . 
* precision = number of digits after decimal .
* JSONparser = a function defined by User to parse external API .
* zoom_level = the current zoom level of the map .

## Options 

### Basic

##### Define the LBL object

See https://github.com/publiclab/leaflet-blurred-location for more details 
     
     var BlurredLocation = new BlurredLocation(options);

##### Passing Coordinates directly into the LBLD API

```js
locations = [[23.1 ,      77.1],
             [20.1 ,      76.1],
             [21.111 ,    76.111],
             [22.111 ,    78.111],
             [23.1234 ,   76.1234],
             [24.123456 , 78.123456],
             [25.123456 , 77.123456]];

var options_display = {
  blurredLocation: BlurredLocation, // compulsory to pass
  locations: locations
}
```

##### Using external API to fetch data

```js
var options_display = {
    blurredLocation: BlurredLocation, // compulsory to pass
    source_url: "https://publiclab.org/api/srch/nearbyPeople", // external API 
    JSONparser: function jsonParser(result) { } // function to parse the above API
  }
```

* JSONparser for external API:
    1. Make an array of object.
    2. Each object should have same parameters - `id`, `url`, `latitude`, `longitude`, `title`.
    3. All the above parameters are used to make pop-up of each marker.
    4. The below is also the default JSONparser which will be used automatically.

```js
function JSONparser(data) {
  parsed_data = []; 
  if (!!data.items) {
    for (i = 0 ; i < data.items.length; i++) {
      let obj = {};
      obj["id"] = data.items[i].doc_id;
      obj["url"] = data.items[i].doc_url;
      obj["latitude"] = parseFloat(data.items[i].latitude);
      obj["longitude"] = parseFloat(data.items[i].longitude);
      obj["title"] = data.items[i].doc_title;
      parsed_data[parsed_data.length] = obj;
    }
  }
  return parsed_data; 
}
```

**[NOTE: We can use external API and also pass local data simultaneously !]

## API

| Methods         | Use                | Usage (Example)|
|-----------------|--------------------|----------------|
|`locations_markers_array()`       | returns array of markers of the input coordinates currently on map ! .|  `blurredLocationDisplay.locations_markers_array() //This would return the array of all the input coordinates currently visible on map`|
|`SourceUrl_markers_array()`       | returns array of markers of the remote coordinates(from some API) currently on map ! |`blurredLocationDisplay.SourceUrl_markers_array() //This would return the array of all the coordinates(fetched from API) currently visible on map`|
|`getMarkersOfPrecision(int)`       | returns object of 2 arrays - one is the array of location/local markers and other is array of remote markers having precision = (int) {all markers are currently visible on map} |`blurredLocationDisplay.getMarkersOfPrecision(2) //This would return 2 arrays - remote markers array and local markers array - having precision = 2 `|
|`filterCoordinatesToPrecison(int)`       | returns array of input coordinates with precision = (int) |`blurredLocationDisplay.filterCoordinatesToPrecison(2) //This would return array of coordinates with precision = 2 only `|


## Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
| **'Blurred' location display** | Your exact location won't be posted, only the grid square it falls within will be shown till the level of precision you have set to your location.|
| **'Blurred' human-readable location display** | The name of the location you added will be displayed till the level of precision you set as the extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc. |
