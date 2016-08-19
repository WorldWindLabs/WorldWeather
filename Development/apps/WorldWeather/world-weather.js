/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

$(document).ready(function () {
  //Fixed location to be used as lightsource for the atmosphere layer
    var FixedLocation = function(wwd) {
      this._wwd = wwd;
    };

    FixedLocation.prototype = Object.create(WorldWind.Location.prototype);

    //Generate fixed location in space for the "Sun"
    Object.defineProperties(FixedLocation.prototype, {

        latitude: {
            get: function () {
                return WorldWind.Location.greatCircleLocation(
                    this._wwd.navigator.lookAtLocation,
                    -40,
                    1.2,
                    new WorldWind.Location()
                ).latitude;
            }
        },

        longitude: {
            get: function () {
                return WorldWind.Location.greatCircleLocation(
                    this._wwd.navigator.lookAtLocation,
                    -40,
                    1.2,
                    new WorldWind.Location()
                ).longitude;
            }
        }

    });

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

    var wwd = new WorldWind.WorldWindow("canvasOne");
    document.wwd = wwd;

    // Initialize the WWW window to a certain altitude, and to the current location of the user
    wwd.navigator.lookAtLocation.altitude = 0;
    wwd.navigator.range = 2.5e7;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (location) {
            wwd.navigator.lookAtLocation.latitude = location.coords.latitude;
            wwd.navigator.lookAtLocation.longitude = location.coords.longitude;
        });
    }
    wwd.redraw();
    // End of initialization

    // Getting timestamps for today, yesterday, and tomorrow
    var current_time = new Date().toISOString();
    var date_stamp = current_time.split('T')[0];
    // End of timestamps code

    // Legends Modal Setup Functions
    var legends_modal_button = $('#legends_modal_delete_button');
    legends_modal_button.on("click", function (e) {
        var legends_modal_selector = $("#legends_modal");
        legends_modal_selector.css('display', 'none');
    });
    // End of Legends Modal code

    var layerManager = new LayerManager(wwd);
    document.layerManager = layerManager;
    layerManager.createProjectionList();

    var projectionLinker = $("#projectionDropdown");
    projectionLinker.find(" li").on("click", function (e) {
        layerManager.onProjectionClick(e);
    });
    projectionLinker.find("button").css({"backgroundColor": "#337ab7"});
    projectionLinker.find("button").css({"border": "none"});

    var digital_elevation_model_capabilities;

    var dem_url = 'http://gis.ngdc.noaa.gov/arcgis/services/dem_hillshades/ImageServer/WMSServer?request=GetCapabilities&service=WMS';
    var gibs_url = 'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WorldWeather&request=GetCapabilities';
    var esa_url = 'http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?REQUEST=GetCapabilities&SERVICE=WorldWeather';
    var noaa_url = 'http://oos.soest.hawaii.edu/thredds/wms/hioos/model/atm/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd?service=WMS&version=1.3.0&request=GetCapabilities';
    var geomet_url = 'http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities';
    var ecmwf_url = 'http://apps.ecmwf.int/wms/?token=MetOceanIE';
    var us_navy_url = 'http://geoint.nrlssc.navy.mil/nrltileserver/wms?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS';
    var neo_url = 'http://neowms.sci.gsfc.nasa.gov/wms/wms';
    var maine_url = 'university-of-maine.kml';

    // Implementing the perfect scrollbar
    $('#options_div').perfectScrollbar();
    $('#selectedlayers').perfectScrollbar();
    $('#legend_division').perfectScrollbar();
    $('#categories_div').perfectScrollbar();
    $('#help_div').perfectScrollbar();
    // end of perfect scrollbar implementation

    // getting digital elevation model from wms server
    try {
        $.get(dem_url,
            function (dem_response) {
                digital_elevation_model_capabilities = new WorldWind.WmsCapabilities(dem_response);
            }).done(function () {
            var digital_elevation_layer =
                new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(digital_elevation_model_capabilities.capability.layers[0]));
            digital_elevation_layer.displayName = "Digital Elevation Model";

            document.viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
            document.viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.02, WorldWind.OFFSET_FRACTION, 0);
            document.viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.02, WorldWind.OFFSET_FRACTION, 0);

            document.viewCoordinatesLayer = new WorldWind.CoordinatesDisplayLayer(wwd);

            var layers = [];
            layers.push(
                {layer: document.viewCoordinatesLayer, enabled: true},
                {layer: document.viewControlsLayer, enabled: true},
                {layer: digital_elevation_layer, enabled: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: true},
                {layer: new WorldWind.BMNGLayer(), enabled: true}
            );

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                wwd.addLayer(layers[l].layer);
            }

            // The code below creates the AtmosphereLayer
            var atmosphereLayer = new WorldWind.AtmosphereLayer();
            atmosphereLayer.lightLocation = new FixedLocation(wwd);
            wwd.addLayer(atmosphereLayer);
            // end of AtmosphereLayer

            layerManager.synchronizeLayerList();
        });
    }
    catch (error) {
        console.log(error);
    }
    // end of digital elevation model from wms server code

    // kml file from cci -- university of maine
    getKmlDataForCombobox(maine_url, "cci_combobox", "cci_layers_options");

    // getting GIBS data from NASA WMTS server code
    getWmtsDataForCombobox(gibs_url, "gibs_combobox", "layers_options", date_stamp);

    // getting ESA (Sentinel) data from WMTS server code
    getWmtsDataForCombobox(esa_url, "esa_combobox", "esa_layers_options", date_stamp);

    // getting data from Geomet WMS Server
    getWmsTimeSeriesForCombobox(geomet_url, "geomet_combobox", "geomet_layers_options", "GDPS.", "GDPS");

    // getting NOAA GFS data from University of Hawaii WMS Server
    getWmsTimeSeriesForCombobox(noaa_url, "noaa_combobox", "noaa_layers_options", "_");

    // retreiving data from ECMWF WMS server
    getWmsTimeSeriesForCombobox(ecmwf_url, "ecmwf_combobox", "ecmwf_layers_options");

    // getting NASA Earth Oberservatory data (NEO) WMS Server
    getWmsTimeSeriesForCombobox(neo_url, "neo_combobox", "neo_layers_options");

    // getting US Navy WMS Server
    getWmsTimeSeriesForCombobox(us_navy_url, "navy_combobox", "navy_layers_options");
});
