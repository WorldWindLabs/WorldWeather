# NASA World Weather
### World Weather is the largest three-dimensional web-based interactive browser of satellite, weather, climate, and other publicly available time-aware geospatial data, built upon NASA's revolutionary World Wind technology. The application can be accessed [by clicking here](http://worldwind.arc.nasa.gov/worldweather/).

## Video Tutorial


<a href="https://www.youtube.com/watch?v=WMYI1UcgFr4">
<img src="http://i.imgur.com/GTxfgk7.png" />
</a>



_The user may also want to check out the <a href="https://www.youtube.com/watch?v=WMYI1UcgFr4">World Weather Tutorial Video</a> before using the application. In this approximately 3 minute video, we walk through the application and demonstrate an example use._



## Introduction

Understanding our climate is one of the most pressing issues of our time, which is why international organizations have been setting up satellites and capturing real-time data of Earth’s atmospheric conditions. Accessing the broad range of weather and climate data with one platform would greatly increase our ability to comprehend the vast stores of ‘big data.’  With one platform on which the information from the myriad of different data sources can be brought together, and displayed accurately in 3D, we would have the opportunity for a truly comprehensive view of the changes occurring to the Earth’s climate. It is also desired to allow any user to interactively view historical, current, and forecast weather information. World Weather is the first web application to display this broad range of weather and other global spatial data in 3D/4D. This gives the world community  a customizable experience that can be utilized by weather forecasters, research scientists studying climate change, and intrigued planetary data enthusiasts.

_Screenshot showing how the Earth looks like through World Weather in its starting position. This image shows the Blue Marble layer as a base; World Weather also supports Bing Maps and a Digital Elevation Layer too._

<img src="https://cloud.githubusercontent.com/assets/19692086/17829775/4b74f010-666e-11e6-8464-0346e03904c1.PNG" />

_Image showing the Dead Sea in Jordan, as shown from ESA Sentinel - True Color layer. World Weather has full three dimensional capabilities, including elevation data for all locations on Earth._ 

<img src="http://i.imgur.com/2HnOm8V.jpg" />

_Screenshot showing World Weather being used to track a storm to the west of Florida (late August of 2016). Using World Weather, you can overlay weather forecasts with real-time satellite images._ 

<img src="http://i.imgur.com/nqK4kV0.png" />

## Features of World Weather

* Load in any number of spatiotemporal geographically accurate data from multiple sources, using a variety of formats including WMTS, WMS, KML, and view them all together.
* Input data sources of different sizes and projections, then see that data in any preferred projection including 3D, Mercator, Equirectangular, Polar and more.
* Adjust the time and date of any layer and easily experience how the visualized data changes with respect to time and space.
* Adjust the opacity of each layer and thereby integrate layers to study groups of information together.
* Change the order for where layers are placed in the hierarchy.
* Read available information about each layer.
* Use the Destination tool to immediately visit any desired location.


## How to Run and Develop World Weather Locally

Start by cloning the repository to your local system. You can do this through the terminal by using the ```git``` command, as outlined below.

```
git clone https://github.com/NASAWorldWindResearch/WorldWeather.git
```

The above code should clone the repository to a folder called WorldWeather. Inside this folder is two main folders: Development and Deployment. The former is used for testing and development purposes, and the latter is kept as a seperate copy, to be used as production. To navigate to the Development folder specific to World Weather, you can use the command outlined below.

```
cd WorldWeather/Development/apps
```

The main heart of the Javascript functions associated with World Weather are contained within the ```world-weather.js``` file in the apps folder. One example of editing this file is through the program vim, which can be used through the following command.

```
vim world-weather.js
```

If you modify the source of NASA World Wind during development, you will need to recompile the source to a minified Javascript file. To do this, navigate to the Developmet folder (one folder back from the apps folder), then run the command ```grunt```. 

```
cd ..
grunt
```

The above command should run succesfully and copy the compiled Javascript file to the apps folder automatically.



***

**Organization:** NASA Ames Research Center

**Manager:** <a href="https://www.linkedin.com/in/phogan">Patrick Hogan</a>

**Authors:** <a href="https://github.com/KhaledSharif">Khaled Sharif</a>, <a href="https://github.com/farahsalah">Farah Salah</a>

**Acknowledgements:** Miguel Del Castillo, Bert Stewart, Gabriel Militão, Benjamin Chang 
