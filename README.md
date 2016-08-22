#NASA World Weather
### World Weather is a 3D/4D web app for interactive display of spatial data, typically satellite data, oriented to deliver weather and climate data.

<img src="http://i.imgur.com/GNI73wr.jpg" />

##Introduction

Understanding our climate is one of the most pressing issues of our time, which is why international organizations have been setting up satellites and capturing real-time data of Earth’s atmospheric conditions. Accessing the broad range of weather and climate data with one platform would greatly increase our ability to comprehend the vast stores of ‘big data.’  With one platform on which the information from the myriad of different data sources can be brought together, and displayed accurately in 3D, we would have the opportunity for a truly comprehensive view of the changes occurring to the Earth’s climate. It is also desired to allow any user to interactively view historical, current, and forecast weather information. World Weather is the first web application to display this broad range of weather and other global spatial data in 3D/4D. This gives the world community  a customizable experience that can be utilized by weather forecasters, research scientists studying climate change, and intrigued planetary data enthusiasts.

<img width="900" alt="application 1" src="https://cloud.githubusercontent.com/assets/19692086/17829775/4b74f010-666e-11e6-8464-0346e03904c1.PNG">

_Image showing the Dead Sea in Jordan, as shown from ESA Sentinel - True Color layer_ 

<img src="http://i.imgur.com/2HnOm8V.jpg">

##Features of WorldWeather

* Load in any number of spatiotemporal geographically accurate data from multiple sources, using a variety of formats including WMTS, WMS, KML, and view them all together.
* Input data sources of different sizes and projections, then see that data in any preferred projection including 3D, Mercator, Equirectangular, Polar and more.
* View any layer's legend.
* Adjust the time and date of any layer and easily experience how the visualized data changes with respect to time and space.
* Adjust the opacity of each layer and thereby integrate layers to study groups of information together.
* Change the order for where layers are placed in the hierarchy.
* Read available information about each layer.
* Use the Destination tool to immediately visit any desired location.


##Data Sources
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png" height="70" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/240px-NOAA_logo.svg.png" height="70" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/ESA_logo_simple.svg/200px-ESA_logo_simple.svg.png" width="70" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Canada_(leaf).svg" height="70"/><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="http://www.helix-nebula.eu/sites/default/files/ecmwf.png" height="70" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="http://climatechange.umaine.edu/images/branding/logo.png" height="70" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" /><img src="http://www.navy.mil/navydata/questions/NavyEmblem.gif" height="70" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="70" />

**NASA Global Imagery Browse Services (GIBS):** global, full-resolution satellite imagery from different NASA data providers. GIBS provides quick access to almost 200 satellite imagery products, covering every part of the world. Most imagery is available within a few hours after satellite overpass and some products span over 15 years.

**ESA SENTINEL:** data from the European Space Agency with focus on Earth observation in three aspects; Atmospheric, Oceanic, and Land monitoring. 

**NOAA Global Forecast System (NOAA GFS):** a weather forecast model created by the National Centers for Environmental Prediction (NCEP). NOAA’s GFS makes available multiple atmospheric and land-soil variables, from temperatures, wind and precipitation, to soil moisture and atmospheric ozone concentration.

**Environment Canada's Meteorological Service of Canada (MSC) GeoMet:** raw numerical weather prediction (NWP) model data layers and the weather radar mosaic. GeoMet provides access to the Environment Canada's MSC raw NWP model data layers and the weather radar mosaic. The GeoMet service is aimed at specialized users with good meteorological and information technology skills that want to visualize raw NWP models and the weather radar mosaic layers.

**European Centre for Medium-Range Weather Forecasts (ECMWF):** the world's largest archive of numerical weather prediction data provided by most of the nations of Europe through this independent intergovernmental organisation. ECMWF, through its partnerships with EUMETSAT, ESA, the EU and the European Science community has established a leading position for Europe in the exploitation of satellite data for operational numerical weather prediction, and for seasonal forecasting coupled with atmosphere-ocean-land models.

**NASA Earth Observations (NEO):** a source of satellite imagery as well as various scientific information related to climate and the environment. Over 50 different global datasets are represented with daily, weekly, and monthly snapshots, with the data being available in a variety of formats.

**Climate Change Institute (CCI):** Source of climate change information from the University of Maine.

**US Navy:** The Geospatial Computing Section at the United States Naval Research Laboratory, which conducts research and development of significant problem areas discoverable via geospatial ‘big data.’

##Application Walk-through

###The different tabs that can be seen on top of the screen are:

**Available Layers:** Choose layers from any data source, several examples of planetary data are provided

**Selected Layers:** Change layer order, turn layers On/Off or discard 

**Layer Controls:** View legends, adjust opacity and manage time series data

**View Options:** Change projection (3D and multiple 2D choices), use the ‘go-to’ Destination, and toggle Screen Controls

**Help:** Guidance regarding how to use the application

**Info:** Information about World Weather

###Available Layers

Start by selecting the layers that you wish to view, in the order that you wish for them to be stacked on top of each other on the globe. Navigate through the source categories Space, Weather, Academia and Government.

_Available Layers_

<img width="402" alt="available 2" src="https://cloud.githubusercontent.com/assets/19692086/17829787/60913788-666e-11e6-8991-32fee4ac8984.png">

_"Weather" tab in Available Layers_

<img width="689" alt="available_air" src="https://cloud.githubusercontent.com/assets/19692086/17829783/607d94bc-666e-11e6-88c1-7f36ce0aea76.png">

###Selected Layers

With Selected Layers, you can manage the layers that you have selected. You can toggle each layer to hide or display it, on or off. Blue signifies a layer is displayed (on), and white signifies a layer is hidden from view (off). You can delete any layer by clicking on the (‘x’) icon for that layer. You can also click on the down and up arrows in order to re-arrange the order of layers. Remember that the uppermost layer in the list is the uppermost layer on the globe.

The 4 topmost layers in the Selected Layers tab cannot be deleted, but can be hidden (again by clicking on them). Those include:

*Digital Elevation Model*, provides the Earth's terrain, the surface elevation data.

*Bing Arial With Labels*, is a view of Earth as provided by Microsoft's Bing that overlays satellite imagery onto the map with roads and major landmarks for easy identification, and labels for countries and cities.

*Blue Marble and Landsat*, is NASA's Blue Marble  composed of Landsat imagery.

*Atmosphere*, gives an atmosphere effect to the globe. This simulates the effect of the Sun by adding light and shadow. It is recommended to hide this layer if the darkness is influencing your view of the selected layers.

_Selected Layers showing on month of Active Fires on Blue Marble with the Atmosphere on_

<img width="896" alt="selected" src="https://cloud.githubusercontent.com/assets/19692086/17829785/607ef8de-666e-11e6-8fe6-edfea55a5494.PNG">

_Selected Layers showing the same active fires, shown on Bing aerial with labels_

<img width="896" alt="selected3" src="https://cloud.githubusercontent.com/assets/19692086/17829781/607cf3f4-666e-11e6-9aa2-88145aea8775.PNG">

_Showing two selected layers on top of each other for the purpose of simultaneous study, here air temperature with total precipitation_

<img width="881" alt="airtempwithprecepitation" src="https://cloud.githubusercontent.com/assets/19692086/17829784/607df68c-666e-11e6-95fc-9872251c663e.PNG">

###Layer Controls
View a legend for each of your selected layers, with information including the date and time of the particular layer. Using the "Date and Time" slider, the layer can be seen at a specific time. The "Opacity" slider can be used to alter the transparency level of each of the layers. The "View" button can be clicked on each legend in order to view that layer alone on the globe. After clicking on any "View" button, it will turn to "Unview", which can be clicked to go back to seeing all the previously selected layers. The "Info" button will display some additional information about that layer, and the "Delete" button will delete the entire layer. (Remember that you can navigate to the "Selected Layers" tab at any point to keep track of which layers you have and which you are viewing.)

_Layer controls showing the legend, date and time slider and opacity slider for the Air Temperature layer_

<img width="893" alt="legends" src="https://cloud.githubusercontent.com/assets/19692086/17829868/d5a0b9a2-6670-11e6-8465-e495dee62283.PNG">

_Demonstrating how clicking "View" on a legend shows that layer alone_

<img width="748" alt="legendview" src="https://cloud.githubusercontent.com/assets/19692086/17829869/d5a0e968-6670-11e6-9cf8-18c73c5e111f.PNG">

###View Options
This is where you can change the projection from the default 3D by clicking on the button under "Change Projection", or select any location to navigate the globe to. You can also disable and enable the additional controls that are on the bottom of the screen from this tab (for example, you can disable them to take a clear screenshot of your globe). Those controls can help you move the globe around, zoom in and out, and obtain the coordinates of any point that you hover over on the globe.

_Demonstrating how the globe can center at the input destination, here NASA Ames Research Center_

<img width="892" alt="destination" src="https://cloud.githubusercontent.com/assets/19692086/17829870/d5a12b3a-6670-11e6-9c2a-9665f3a7a554.PNG">

_Demonstrating how the projection can be changed, here to Equirectangular_

<img width="897" alt="equirectangular" src="https://cloud.githubusercontent.com/assets/19692086/17829788/6092a230-666e-11e6-98cb-96a291e2a858.PNG">

###Help
This tab provides information to the user regarding how to use the site. This can be refered to at any point for additional help.

_The Help tab_
<img width="897" alt="help" src="https://cloud.githubusercontent.com/assets/19692086/17829872/d5a4c420-6670-11e6-82ec-594034d25bcb.PNG">

###Info
Provides some general information about the app
