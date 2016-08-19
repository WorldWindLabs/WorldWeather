#NASA World Weather
### The largest three-dimensional web-based interactive browser of satellite, weather, climate, and other time-aware geospatial data on the web, built upon NASA's revolutionary WorldWind technology.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png" width="190px" />

##Introduction

Gathering information about our climate is one of the most pressing issues of our time, which is why international organizations have been setting up satellites and capturing real-time images of the atmospheric conditions on Earth. However, in order to give a truly comprehensive view of the changes occurring to the Earth’s climate, it has become necessary to have one platform on which the information from all those different data sources can be brought together, and displayed accurately in 3D. It is also desired to allow any user to interactively view past, present, and future weather information. Built upon NASA World Wind, NASA World Weather is the first web application to ever display such a broad range of weather and other global spatial data viewed together in 3D. This gives the user a great customizable experience that can be utilized by weather forecasters, research scientists studying climate change, and even intrigued enthusiasts.

##Features of WorldWeather

* Load in any number of spatiotemporal geographically accurate data from mutiple sources, in different formats including WMTS, WMS, KML, and view them together.
* Input data sources of different sizes and projections, then change the output projection to 3D, Mercator, Equirectangular.
* Inspect any layer's legend
* Adjust the time and date of any layer seperately, and see how the graphical information changes with respect to time and space.
* Adjust the opacity of each layer, thereby integrating layers and studying groups of information together.
* Change the order of which your layers are placed on top of each other
* Read relavent information about each layer
* Use the search bar to navigate the globe to any desired position

##Data Sources
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/240px-NOAA_logo.svg.png" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/ESA_logo_simple.svg/200px-ESA_logo_simple.svg.png" width="48" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Canada_(leaf).svg" height="48"/><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="http://www.helix-nebula.eu/sites/default/files/ecmwf.png" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="http://climatechange.umaine.edu/images/branding/logo.png" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" /><img src="http://www.navy.mil/navydata/questions/NavyEmblem.gif" height="48" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="28" height="48" />

**NASA Global Imagery Browse Services (GIBS):** global, full-resolution satellite imagery from different NASA data providers. GIBS provides quick access to almost 200 satellite imagery products, covering every part of the world. Most imagery is available with a few hours after satellite overpass and some products span over 15 years. In total, there are over 240 trillion pixels' worth of imagery available to be rendered in your own web client or GIS application.

**ESA SENTINEL:** data from the European Space Agency with focus on Earth observation in three aspects; Atmospheric, Oceanic, and Land monitoring. The goal of the SENTINEL program is to replace the current older Earth observation missions which have reached retirement, such as the ERS mission, or are currently nearing the end of their operational life span. This will ensure a continuity of data so that there are no gaps in ongoing studies.

**NOAA Global Forecast System (NOAA GFS):** a weather forecast model created by the National Centers for Environmental Prediction (NCEP). It makes available multiple atmospheric and land-soil variables, from temperatures, winds, and precipitation to soil moisture and atmospheric ozone concentration.

**Environment Canada's Meteorological Service of Canada (MSC) GeoMet:** raw numerical weather prediction (NWP) model data layers and the weather radar mosaic. GeoMet provides access to the Environment Canada's Meteorological Service of Canada (MSC) raw numerical weather prediction (NWP) model data layers and the weather radar mosaic. The GeoMet service is aimed at specialized users with good meteorological and information technology knowledge that want to visualize raw NWP models and the weather radar mosaic layers

**European Centre for Medium-Range Weather Forecasts (ECMWF):** the world's largest archive of numerical weather prediction data provided by most of the nations of Europe through this independent intergovernmental organisation. ECMWF, through its partnerships with EUMETSAT, ESA, the EU and the European Science community has established a leading position for Europe in the exploitation of satellite data for operational numerical weather prediction, and for operational seasonal forecasting with coupled atmosphere-ocean-land models.

**NASA Earth Observations (NEO):** a source of satellite imagery as well as different scientific information that is related to the climate and the environment. NEO's mission is to help users picture climate and environmental changes as they occur on our home planet. Over 50 different global datasets are represented with daily, weekly, and monthly snapshots, and images are available in a variety of formats.

**Climate Change Institute (CCI):** Source of climate change information from the University of Maine.

**US Navy:** The Geospatial Computing Section at the United States Naval Research Laboratory, which conducts research and development on significant problems involving the collection, processing and distribution of geospatial data.

##Application Walkthrough

###The different tabs that can be seen on top of the screen are:

**Available Layers:** This is where you can choose layers from any data source, several examples of planetary data are provided

**Selected Layers:** Layer Order, On/Off/Discard Layer

**Layer Controls:** Legend View, Opacity and Time Series Control

**View Options:** Projection (3D and multiple 2D choices), Destination Selector, toggle Screen Controls

**Help:** Information about how to use the site

##Available Layers

Start by selecting the layers that you wish to view, in the order that you wish for them to be stacked on top of each other on the globe. Navigate through the pages in order to view more data sources. 

###Selected Layers

Here, you can view the layers that you have just selected. You can click on each layer in order to hide or display it. Any button that is blue is a layer that is displayed, and any that is white represents a layer that is hidden from view. You can even delete any layer using the (x) icon. You can also click on the downward and upward arrows in order to re-arrange the layers. Remember that the downmost layer in the list is the uppermost layer on the globe.

The 4 topmost layers in the Selected Layers tab cannot be deleted, but can be hidden (again by clicking on them). Those include:

*Digital Elevation Model*, which is a 3D representation of the Earth's surface using terrain elevation data.

*Bing Arial With Labels*, which is a view of Earth as given by Microsoft's Bing that overlays satellite imagery onto the map and highlights roads and major landmarks for easy identification, and provides labels for countries and cities.

*Blue Marble and Landsat*, which is NASA's Blue Marble photograph of the Earth, taken on December 7th 1972 by the crew of the Apollo 17 spacecraft, overlayed wih Landsat images.

*Atmosphere*, which gives an atmosphere effect to the globe, with simulates the effect of the sun by adding light and shadow. It is recommended to hide this layer if the darkness is influencing your view of the selected layers.

###Layer Controls
View a legend for each of your selected layers, with information including the date and time of the particular layer. Using the "Date and Time" slider, the layer can be seen at a specific time. The "Opacity" slider can be used to alter the transparency level of each of the layers. The "View" button can be clicked on each legend in order to view that layer alone on the globe. After clicking on any "View" button, it will turn to "Unview", which can be clicked to go back to seeing all the previously selected layers. The "Info" button will display some additional information about that layer, and the "Delete" button will delete the entire layer. (Remember that you can navigate to the "Selected Layers" tab at any point to keep track of which layers you have and which you are viewing.)

###View Options
This is where you can change the projection from the default 3D by clicking on the button under "Change Projection", or select any location to navigate the globe to. You can also disable and enable the additional controls that are on the bottom of the screen from this tab (for example, you can disable them to take a clear screenshot of your globe). Those controls can help you move the globe around, zoom in and out, and obtain the coordinates of any point that you hover over on the globe.

###Help
This tab provides information to the user regarding how to use the site. This can be refered to at any point for additional help.

Note that you can move the globe around by dragging the screen. You can also zoom in and out using your mouse or touchpad, or by using the controls at the bottom.

