/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

$(document).ready(function ()
{
    "use strict";
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

    var wwd = new WorldWind.WorldWindow("canvasOne");
    document.wwd = wwd;

    // Initialize the WWW window to a certain altitude
    wwd.navigator.lookAtLocation.altitude = 0;
    wwd.navigator.range = 2.5e7;
    wwd.redraw();
    // End of initialization

    // Getting timestamps for today, yesterday, and tomorrow
    var current_time = new Date().toISOString();
    var date_stamp = current_time.split('T')[0];

    var tomorrow_time = new Date(Date.now() + 86400000).toISOString();
    var tomorrow_date_stamp = tomorrow_time.split('T')[0];

    var yesterday_time = new Date(Date.now() - 86400000).toISOString();
    var yesterday_date_stamp = yesterday_time.split('T')[0];
    // End of timestamps code

    // Legends Modal Setup Functions
    var legends_modal_button = $('#legends_modal_delete_button');
    legends_modal_button.on("click", function(e) {
        var legends_modal_selector = $("#legends_modal");
        legends_modal_selector.css('display','none');
    });
    // End of Legends Modal code

    var basic_layers = [ {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
                         {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: true} ];

    for (var l = 0; l < basic_layers.length; l++) {
        basic_layers[l].layer.enabled = basic_layers[l].enabled;
        wwd.addLayer(basic_layers[l].layer);
    }

    // The code below creates the AtmosphereLayer 
    var lightLocation = new WorldWind.Position(25, 190, 0);
    var atmosphereLayer = new WorldWind.AtmosphereLayer();
    atmosphereLayer.lightLocation = lightLocation;
    wwd.addLayer(atmosphereLayer);
    // end of AtmosphereLayer

    var layerManager = new LayerManager(wwd);
    layerManager.createProjectionList();

    var projectionLinker = $("#projectionDropdown");
    projectionLinker.find(" li").on("click", function (e) { layerManager.onProjectionClick(e); });
    projectionLinker.find("button").css({"backgroundColor": "#337ab7"});
    projectionLinker.find("button").css({"border": "none"});

    var digital_elevation_model_capabilities, gibs_wmts_capabilities, esa_wmts_capabilities,
        geomet_wms_capabilities, ecmwf_wms_capabilities, neo_wms_capabilities, noaa_wms_capabilities;

    var dem_url = 'http://gis.ngdc.noaa.gov/arcgis/services/dem_hillshades/ImageServer/WMSServer?request=GetCapabilities&service=WMS';
    var gibs_url = 'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WorldWeather&request=GetCapabilities';
    var esa_url = 'http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?REQUEST=GetCapabilities&SERVICE=WorldWeather';
    var noaa_url = 'http://oos.soest.hawaii.edu/thredds/wms/hioos/model/atm/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd?service=WMS&version=1.3.0&request=GetCapabilities';
    var geomet_url = 'http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities';
    var ecmwf_url = 'http://apps.ecmwf.int/wms/?token=MetOceanIE';
    var neo_url = 'http://neowms.sci.gsfc.nasa.gov/wms/wms';

    // Implementing the perfect scrollbar
    $('#options_div').perfectScrollbar();
    $('#selectedlayers').perfectScrollbar();
    $('#legend_division').perfectScrollbar();
    $('#categories_div').perfectScrollbar();
    $('#help_div').perfectScrollbar();
    // end of perfect scrollbar implementation

    // getting digital elevation model from wms server
    try {   $.get(dem_url,
            function (dem_response) { digital_elevation_model_capabilities = new WorldWind.WmsCapabilities(dem_response); }).done(function () 
            {
            var digital_elevation_layer =
                new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(digital_elevation_model_capabilities.capability.layers[0]));

            var viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
            viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);
            viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);

            var layers = [];
            layers.push(
                {layer: new WorldWind.CompassLayer(), enabled: false},
                {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                {layer: viewControlsLayer, enabled: true},
                {layer: digital_elevation_layer, enabled: true}
            );

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                wwd.addLayer(layers[l].layer);
            }
            wwd.layers.move(wwd.layers.length - 1, 0);
            layerManager.synchronizeLayerList();
        });
    }
    catch (error) {
        console.log(error);
    }
    // end of digital elevation model from wms server code

    // getting GIBS data from NASA WMTS server code
    try {
        $.get(gibs_url, function (gibs_response) { gibs_wmts_capabilities = new WorldWind.WmtsCapabilities(gibs_response); }).done(function () 
        {
            var gibs_data = [];
            var additionalContent = {};

            function GIBS_recursive(section) {
                if (section.layer && section.layer.length > 0) {
                    for (var i = 0; i < section.layer.length; i++) GIBS_recursive(section.layer[i]);
                }
                else {
                    if (section.title && section.title != "") {
                        var gibs_layer = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
                        gibs_layer.enabled = false;
                        wwd.addLayer(gibs_layer);
                        gibs_data.push(gibs_layer.displayName);
                    }
                }
            }
            GIBS_recursive(gibs_wmts_capabilities.contents);

            // GIBS html layers
            var html_layers = "<label><select class=\"gibs_combobox explorer_combobox\"><option></option>";
            for (var j = 0; j < gibs_data.length; j++) {
                html_layers += "<option><a>" + gibs_data[j] + "</a></option>";
                for (var key in gibs_categorical_data) {
                    if (gibs_categorical_data.hasOwnProperty(key)) {
                        if (gibs_categorical_data[key].indexOf(gibs_data[j]) > -1) {
                            if (key in additionalContent) additionalContent[key].push(gibs_data[j]);
                            else additionalContent[key] = [gibs_data[j]];
                        }
                    }
                }
            }
            updateLayerCategories(additionalContent);
            html_layers += "</select></label>";

            var gibs_layers_options = $("#layers_options");
            gibs_layers_options.html(html_layers);
            $('.gibs_combobox').combobox();
            gibs_layers_options.find("select").on("change", function (e) {
                layerManager.onNASALayerClick(e);
            });
        });
    }
    catch (error) {
        console.log(error);
        $("#layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // end of GIBS data retrieval code

    // getting ESA (Sentinel) data from WMTS server code
    try {
        $.get(esa_url, function (esa_response) {
            esa_wmts_capabilities = new WorldWind.WmtsCapabilities(esa_response);
        }).done(function () {
            var esa_data = [];
            var additionalContent = {};

            function ESA_recursive(section) {
                if (section.layer && section.layer.length > 0) 
                    for (var i = 0; i < section.layer.length; i++) ESA_recursive(section.layer[i]);
                else {
                    if (section.title && section.title != "") {
                        var esa_layer = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
                        esa_layer.enabled = false;
                        wwd.addLayer(esa_layer);
                        esa_data.push(esa_layer.displayName);
                    }
                }
            }

            ESA_recursive(esa_wmts_capabilities.contents);

            // Sentinel html layers
            var html_layers = "<label><select class=\"esa_combobox explorer_combobox\"><option></option>";
            for (var k = 0; k < esa_data.length; k++) {
                html_layers += "<option><a>" + esa_data[k] + "</a></option>";
                for (var key in esa_categorical_data) {
                    if (esa_categorical_data.hasOwnProperty(key)) {
                        if (esa_categorical_data[key].indexOf(esa_data[k]) > -1)
                        {
                            if (key in additionalContent) additionalContent[key].push(esa_data[k]);
                            else additionalContent[key] = [esa_data[k]];
                        }
                    }
                }
            }
            html_layers += "</select></label>";

            // TODO: add the rest of the data sources to categorical tab
            // updateLayerCategories(additionalContent);

            var esa_layers_options = $("#esa_layers_options");
            esa_layers_options.html(html_layers);
            $('.esa_combobox').combobox();
            esa_layers_options.find("select").on("change", function (e) {
                layerManager.onESALayerClick(e);
            });
        });
    }
    catch (error) {
        console.log(error);
        $("#esa_layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // End of ESA sentinel data retrieval

    // getting data from Geomet WMS Server
    try {
        $.get(geomet_url, function (geomet_response) {
            geomet_wms_capabilities = new WorldWind.WmsCapabilities(geomet_response);
        }).done(function () {
            var geomet_data = [];

            function GEOMET_recursive(section) {
                if (section.layers && section.layers.length > 0) {
                    for (var i = 0; i < section.layers.length; i++) GEOMET_recursive(section.layers[i]);
                } else {
                    if (section.title && section.title != "") {
                        if (section.title.indexOf("GDPS") !== -1) {
                            section.title = section.title.replace("GDPS.", "");
                            var geomet_layer
                                = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section), tomorrow_date_stamp);
                            geomet_layer.enabled = false;
                            wwd.addLayer(geomet_layer);
                            geomet_data.push(geomet_layer.displayName);
                        }
                    }
                }
            }
            GEOMET_recursive(geomet_wms_capabilities.capability);

            // GEOMET html layers
            var html_layers = "<label><select class=\"geomet_combobox explorer_combobox\"><option></option>";
            for (var n = 0; n < geomet_data.length; n++) html_layers += "<option><a >" + geomet_data[n] + "</a></option>";
            html_layers += "</select></label>";

            var geomet_layers_options = $("#geomet_layers_options");
            geomet_layers_options.html(html_layers);
            $('.geomet_combobox').combobox();
            geomet_layers_options.find("select").on("change", function (e) { layerManager.onGEOMETLayerClick(e); });
        });
    }
    catch (error) {
        console.log(error);
        $("#geomet_layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // end of Geomet wms server code

    // getting NOAA GFS data from University of Hawaii WMS Server
    try {
        $.get(noaa_url, function (noaa_response) { noaa_wms_capabilities = new WorldWind.WmsCapabilities(noaa_response); }).done(function () 
        {
            var noaa_data = [];

            function NOAA_recursive(section) {
                if (section.layers && section.layers.length > 0) {
                    for (var i = 0; i < section.layers.length; i++) NOAA_recursive(section.layers[i]);
                } else {
                    if (section.title && section.title != "") 
                    {
                        section.title = titleCase(section.title.replaceAll("_", " "));
                        var noaa_layer
                            = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section), tomorrow_date_stamp);
                        noaa_layer.enabled = false;
                        wwd.addLayer(noaa_layer);
                        noaa_data.push(noaa_layer.displayName);
                    }
                }
            }
            NOAA_recursive(noaa_wms_capabilities.capability);

            // NOAA html layers
            var html_layers = "<label><select class=\"noaa_combobox explorer_combobox\"><option></option>";
            for (var n = 0; n < noaa_data.length; n++) {
                html_layers += "<option><a >" + noaa_data[n] + "</a></option>";
            }
            html_layers += "</select></label>";

            var noaa_layers_options = $("#noaa_layers_options");
            noaa_layers_options.html(html_layers);
            $('.noaa_combobox').combobox();
            noaa_layers_options.find("select").on("change", function (e) {
                layerManager.onNOAALayerClick(e);
            });
        });
    }
    catch (error) {
        console.log(error);
        $("#noaa_layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // end of NOAA WMS data retrieval

    // retreiving data from ECMWF WMS server
    try {
        $.get(ecmwf_url, function (esa_response) { ecmwf_wms_capabilities = new WorldWind.WmsCapabilities(esa_response); }).done(function () 
        {
            var ecmwf_data = [];

            function ECMWF_recursive (section) {
                if (section.layers && section.layers.length > 0) {
                    for (var i = 0; i < section.layers.length; i++) ECMWF_recursive(section.layers[i]);
                } else {
                    if (section.title && section.title != "") {
                        var ecmwf_layer = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section));
                        ecmwf_layer.enabled = false;
                        wwd.addLayer(ecmwf_layer);
                        ecmwf_data.push(ecmwf_layer.displayName);
                    }
                }
            }
            ECMWF_recursive(ecmwf_wms_capabilities.capability);

            // ECMWF html layers
            var html_layers = "<label><select class=\"ecmwf_combobox explorer_combobox\"><option></option>";
            for (var r = 0; r < ecmwf_data.length; r++) html_layers += "<option><a >" + ecmwf_data[r] + "</a></option>";
            html_layers += "</select></label>";

            var ecmwf_layers_options = $("#ecmwf_layers_options");
            ecmwf_layers_options.html(html_layers);
            $('.ecmwf_combobox').combobox();
            ecmwf_layers_options.find("select").on("change", function (e) { layerManager.onECMWFLayerClick(e); });
        });
    }
    catch (error) {
        console.log(error);
        $("#ecmwf_layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // end of ECMWF data retrieval

    // getting NASA Earth Oberservatory data (NEO) WMS Server
    try {
        $.get(neo_url, function (neo_response) {
            neo_wms_capabilities = new WorldWind.WmsCapabilities(neo_response);
        }).done(function () {
            var neo_data = [];

            function NEO_recursive(section) {
                if (section.layers && section.layers.length > 0) {
                    for (var i = 0; i < section.layers.length; i++) NEO_recursive(section.layers[i]);
                } else {
                    if (section.title && section.title != "") {
                        var neo_layer = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section));
                        neo_layer.enabled = false;
                        wwd.addLayer(neo_layer);
                        neo_data.push(neo_layer.displayName);
                    }
                }
            }

            // NEO layers
            NEO_recursive(neo_wms_capabilities.capability);

            // NEO html layers
            var html_layers = "<label><select class=\"neo_combobox explorer_combobox\"><option></option>";
            for (var p = 0; p < neo_data.length; p++) html_layers += "<option><a >" + neo_data[p] + "</a></option>";
            html_layers += "</select></label>";

            var neo_layers_options = $("#neo_layers_options");
            neo_layers_options.html(html_layers);
            $('.neo_combobox').combobox();
            neo_layers_options.find("select").on("change", function (e) { layerManager.onNEOLayerClick(e); });
        });
    }
    catch (error) {
        console.log(error);
        $("#neo_layers_options").html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
    // end of NEO data retrieval

});
