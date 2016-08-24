/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

$(document).ready(function () {
    // this global variable decides the amount of resolution each tile gets
    // the higher the number is, the less resolution each tile has
    // the default number for this tile is 1.75 (this is what WWW originally had)
    document.globalDetailControl = 1.5;

    // enable all tooltips except on touchscreens
    function isTouchDevice() {
        return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    }
    if (isTouchDevice() === false) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // This line turns off all warnings that come out of WWW. Turn this back on if
    // you want to do some debugging, but please always keep it off when deploying.
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

    var wwd = new WorldWind.WorldWindow("canvasOne");
    wwd.isLeftGlobe = true;
    var wwd_duplicate = new WorldWind.WorldWindow("canvasTwo");
    wwd_duplicate.isLeftGlobe = false;

    document.wwd = wwd;
    document.wwd_duplicate = wwd_duplicate;

    document.wwd_original_navigator = wwd.navigator;
    document.wwd_duplicated_navigator = wwd_duplicate.navigator;
    document.wwd_duplicated_navigator.isForDuplicateGlobe = true;

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

    var layerManager = new LayerManager(wwd, wwd_duplicate);
    //var layerManager_duplicated = new LayerManager(wwd_duplicate);
    document.layerManager = layerManager;
    //document.layerManager_duplicated = layerManager_duplicated;
    layerManager.createProjectionList();

    var projectionLinker = $("#projectionDropdown");
    projectionLinker.find(" li").on("click", function (e) {
        layerManager.onProjectionClick(e);
    });
    projectionLinker.find("button").css({"backgroundColor": "#337ab7"});
    projectionLinker.find("button").css({"border": "none"});

    var digital_elevation_model_capabilities;

    // Single layer from NOAA to become a base layer
    var dem_url = 'http://gis.ngdc.noaa.gov/arcgis/services/dem_hillshades/ImageServer/WMSServer?request=GetCapabilities&service=WMS';

    // WMTS Servers
    var gibs_url = 'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WorldWeather&request=GetCapabilities';
    var esa_url = 'http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?REQUEST=GetCapabilities&SERVICE=WorldWeather';
    var dlr_wmts_url = 'http://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities';

    // WMS Servers
    var noaa_url = 'http://oos.soest.hawaii.edu/thredds/wms/hioos/model/atm/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd?service=WMS&version=1.3.0&request=GetCapabilities';
    var geomet_url = 'http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities';
    var ecmwf_url = 'http://apps.ecmwf.int/wms/?token=MetOceanIE';
    var us_navy_url = 'http://geoint.nrlssc.navy.mil/nrltileserver/wms?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS';
    var neo_url = 'http://neowms.sci.gsfc.nasa.gov/wms/wms';

    var dlr_urls = ['http://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        'http://geoservice.dlr.de/eoc/elevation/wms?SERVICE=WMS&REQUEST=GetCapabilities', 'http://geoservice.dlr.de/eoc/basemap/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        'http://geoservice.dlr.de/eoc/imagery/wms?SERVICE=WMS&REQUEST=GetCapabilities', 'http://geoservice.dlr.de/eoc/land/wms?SERVICE=WMS&REQUEST=GetCapabilities'];

    // KML files locally saved
    var maine_url = 'university-of-maine-new.kml';

    // Implementing the perfect scrollbar
    $('#options_div').perfectScrollbar();
    $('#selectedlayers').perfectScrollbar();
    $('#legend_division').perfectScrollbar();
    $('#categories_div').perfectScrollbar();
    $('#help_div').perfectScrollbar();
    $('#info_div').perfectScrollbar();
    // end of perfect scrollbar implementation

    // getting digital elevation model from wms server
    try {
        $.get(dem_url,
            function (dem_response) {
                digital_elevation_model_capabilities = new WorldWind.WmsCapabilities(dem_response);
            }).done(function () {
            var digital_elevation_layer = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(digital_elevation_model_capabilities.capability.layers[0]));
            digital_elevation_layer.displayName = "Digital Elevation Model";

            var layers = [];
            layers.push(
                {layer: digital_elevation_layer, enabled: false, layerSelected: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: false, layerSelected: true},
                {layer: new WorldWind.BMNGLayer(), enabled: true}
            );

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                if ('layerSelected' in layers[l]) layers[l].layer.layerSelected = layers[l].layerSelected;
                layers[l].layer.isBaseLayer = true;
                wwd.addLayer(layers[l].layer);
                wwd_duplicate.addLayer(layers[l].layer);
            }

            // The code below creates the AtmosphereLayer
            var atmosphereLayer = new WorldWind.AtmosphereLayer();
            atmosphereLayer.isBaseLayer = true;
            wwd.addLayer(atmosphereLayer);
            wwd_duplicate.addLayer(atmosphereLayer);
            // end of AtmosphereLayer

            layerManager.synchronizeLayerList();
        });
    }
    catch (error) {
        console.log(error);
    }
    // end of digital elevation model from wms server code

    // getting data within kml file from CCI -- university of maine
    getKmlDataForCombobox(maine_url, "cci_combobox", "cci_layers_options");

    // getting GIBS data from NASA WMTS server
    getWmtsDataForCombobox(gibs_url, "gibs_combobox", "layers_options", date_stamp);

    // getting ESA (Sentinel) data from WMTS server
    getWmtsDataForCombobox(esa_url, "esa_combobox", "esa_layers_options", date_stamp);

    // getting DLR (WMTS) geoservice WMTS server
    getWmtsDataForCombobox(dlr_wmts_url, "dlr_wmts_combobox", "dlr_wmts_layers_options", date_stamp);

    // getting data from Geomet WMS Server
    getWmsTimeSeriesForCombobox(geomet_url, "geomet_combobox", "geomet_layers_options", "GDPS.", "GDPS");

    // getting NOAA GFS data from University of Hawaii WMS Server
    getWmsTimeSeriesForCombobox(noaa_url, "noaa_combobox", "noaa_layers_options", "_");

    // getting data from ECMWF WMS server
    getWmsTimeSeriesForCombobox(ecmwf_url, "ecmwf_combobox", "ecmwf_layers_options");

    // getting NASA Earth Oberservatory data (NEO) WMS Server
    getWmsTimeSeriesForCombobox(neo_url, "neo_combobox", "neo_layers_options");

    // getting US Navy WMS Server
    getWmsTimeSeriesForCombobox(us_navy_url, "navy_combobox", "navy_layers_options");

    // getting a bunch of DLR WMS servers all at once
    getMultipleWmsTimeSeries(dlr_urls, "dlr_combobox", "dlr_layers_options");
});
