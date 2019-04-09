leaflet-blurred-location-display (LBLD)
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location-display.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location-display)


leaflet-blurred-location-display is an extension of leaflet-blurred-location and does the following:

* Cleverly dispays your location, keeping your privacy settings in mind.
* Color code the markers on the map according to the precision.
* Fetches data from remote API or you may pass array of coordinates directly into LBLD API (see example below)

# Demo

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

# Setting up leaflet-blurred-location-display

To set up the library first clone this repo to your local after that run 'npm install' to install all the neccessary packages required.


# Some terms used

* LBLD = leaflet-blurred-location-display .
* LBL = leaflet-blurred-location
* remote markers = markers made from external API .
* local markers = markers made from static data provided directly into LBLD API . 
* precision = number of digits after decimal .
* JSONparser = a function defined by User to parse external API .
* zoom_level = the current zoom level of the map .

# Options 

## Basic

#### Define standard leaflet map object :

     var map123 = L.map('map').setView([23,77] , 3) ; // There should be a div with id = 'map' .

#### Define the LBL object :

See https://github.com/publiclab/leaflet-blurred-location for more details 
     
     var BlurredLocation = new BlurredLocation();
     blurredLocation.addTo(map123) ;
     
#### Define LBLD object : 
    
     var blurredLocationDisplay = new BlurredLocationDisplay(options_display) ;
     
You need to pass some LBLD settings in the `options_display` object above , which are explained in the next section :

##### Various fields in `options_display` : 

```js
 var options_display = {
        blurredLocation: BlurredLocation,
        locations: locations,
        source_url: "https://publiclab.org/api/srch/nearbyPeople",
        JSONparser: JSONparser,
        zoom_filter: zoom_filter,
        color_code_markers: false, // by default this is false .
        style: 'both' // or 'heatmap' or 'markers' , by default is 'both'
 }
```

*    `blurredLocation` : This is compulsory field , you have to pass the LBL object here .
*    `locations` : You can pass some local data directly to LBLD API in the form of array .
*    `source_url`: URL to external API to fetch data and show on map .
*    `JSONparser`: JSON parser function for your API URL provided .
*    `zoom_filter` : An array signifying the range of zoom levels where particular precision markers should be visible .
*    `color_code_markers` : If `true` , then markers would be color coded according to the precision of its coordinates . 
*    `style` : can be `both` where markers and heatmap both are drawn , `markers` for showing only markers and `heatmap` for                showing  only heatmap .

All these parameters are explained in detail below : 

#### There are 2 ways to show data using LBLD : 
*  Pass the data directly to LBLD object locally . 
*  Pass the URL of JSON data and a custom JSON parser function .

##### 1.) Passing Coordinates directly into the LBLD API :

First, you need to make some blurred locations. Let's create 3 of them :

```js
locations = [[23.1 ,      77.1],
             [20.1 ,      76.1],
             [21.111 ,    76.111];
```
Now you can pass them to the `options_display` object as following : 

```
var options_display = {
  blurredLocation: BlurredLocation, // compulsory to pass
  locations: locations
}
```
##### 2.) Using external API to fetch data :

Pass the URL in the `source_url` field and a JSON parser function for your API (you can take a look at the default JSON parser below to make your own !) .

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
    4. The below is also the default JSONparser which will be used automatically if you do not provide your own .

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


#### Changing the zoom levels range where 'x' precision marker should be visible : 

```js
    // [lower zoom level , upper zoom level , >= precision allowed]
      zoom_filter = [[0,5,0] , [5,7,2] , [8,10,4] , [11,18,5]] ;     
```
The first number signifies the lower zoom level . 

The second number signifies the upper zoom level . 

The last number signifies that all markers having precision greater than equal to this number should be shown between lower zoom level and upper zoom level range .

The default zoom level filter array is : 
```js
[[0,5,0] , [5,7,2] , [8,10,4] , [11,18,5]] ;
```

#### Style parameter : 

1.) style = `heatmap` shows only heatmap on map : 
![heatmap](https://user-images.githubusercontent.com/14952645/55791553-5e207080-5adc-11e9-89f8-5df6eaf63965.png)

2.) style = `markers` shows only markers on map .
![markers](https://user-images.githubusercontent.com/14952645/55819532-9ba1ef80-5b16-11e9-8f38-1276f5d4f046.png)

3.) style = `both` shows both heatmap and markers on map :
![both](https://publiclab.org/i/30983.png)


# API

| Methods         | Use                | Usage (Example)|
|-----------------|--------------------|----------------|
|`locations_markers_array()`       | returns array of markers of the input coordinates currently on map ! .|  `blurredLocationDisplay.locations_markers_array() //This would return the array of all the input coordinates currently visible on map`|
|`SourceUrl_markers_array()`       | returns array of markers of the remote coordinates(from some API) currently on map ! |`blurredLocationDisplay.SourceUrl_markers_array() //This would return the array of all the coordinates(fetched from API) currently visible on map`|
|`getMarkersOfPrecision(int)`       | returns object of 2 arrays - one is the array of location/local markers and other is array of remote markers having precision = (int) {all markers are currently visible on map} |`blurredLocationDisplay.getMarkersOfPrecision(2) //This would return 2 arrays - remote markers array and local markers array - having precision = 2 `|
|`filterCoordinatesToPrecison(int)`       | returns array of input coordinates with precision = (int) |`blurredLocationDisplay.filterCoordinatesToPrecison(2) //This would return array of coordinates with precision = 2 only `|


# Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
| **'Blurred' location display** | Your exact location won't be posted, only the grid square it falls within will be shown till the level of precision you have set to your location.|
| **'Blurred' human-readable location display** | The name of the location you added will be displayed till the level of precision you set as the extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc. |



#### 1.) Lower the precision , Greater the privacy :

The red markers corresponds to coordinates \[23.1 , 77.1\] , \[20.1 , 76.1\] having precision of 1 . At lower zoom level 5\*\*\*\* , these red markers are visible on map . ![image description](https://publiclab.org/i/30975.png)

But as you zoom in to level 6 , these red markers are removed from the map whereas other high precision markers are still visible .  
![image description](https://publiclab.org/i/30976.png)

#### 2.) Color Coding of the markers :

According to the precision of the coordinates , different colors are given to the markers .

Precision = 0 , Blue colored markers .

Precision = 1 , Red colored markers .

Precision = 2 , Orange colored markers .

Precision = 3 , Green colored markers .

Precision = 4 , Black colored markers .

Precision = 5 , Grey colored markers .

Precision \>= 6 , Yellow colored markers .

Also clicking the markers shows a pop-up telling the precision :  
![image description](https://publiclab.org/i/30981.png)

---------

#### 3.) Heat map :

**Greater the markers in a region , Darker the color .**

We wanted to give an easy visualization power , so we implemented this grid heat map .

![image description](https://publiclab.org/i/30983.png)

The default color of grid is : #F3F0C0

If number of markers are in range [1,10] , the color is : #FFA500

If number of markers are in range [11,15] , the color is : #faff05

If number of markers are in range [16,25] , the color is : #FF6347

If number of markers are in range [26,35] , the color is : #FF4500

If number of markers are in range [36,45] , the color is : #FF0000

If number of markers are greater than 45 , the color is :#8B0000

NOTE : Clicking on each rectangle shows the pop-up showing number of markers in that rectangle .

