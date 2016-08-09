/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_GIBS.js 2016-06-09 rsirac $
 */

function pad(number) {
    if (number < 10) {
        return '0' + number.toString();
    }
    return number.toString();
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

//Managing the tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    //If the page has just been loaded, Get all elements with class="tabcontent" and hide them
    if (document.isInit) {
        // do nothing
    }
    else {
        document.isInit = 1;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
    }

    // Get all elements with class="tablinks" and remove the attribute "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].hasAttribute("target", "active")) {

            tablinks[i].removeAttribute("target", "active");
        }

    }

    // Show the current tab, and add an "active" attribute to the link
    // that opened the tab, or removes it if it was already open

    if (document.getElementById(tabName).style.display == "none") {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.setAttribute("target", "active");

    }
    else {
        document.getElementById(tabName).style.display = "none";
        document.getElementById(tabName).className.replace("active", "");
        evt.currentTarget.removeAttribute("target", "active");


    }

    // remove all other tabs except for the one that was clicked, but do not let this apply to he help tab

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {

        if (tabcontent[i].id != tabName.toString() && tabcontent[i].id != "help_div" && tabName.toString() != "help_div")
            tabcontent[i].style.display = "none";
    }
}

function openPage(evt, pageName) {
    var i, pagecontent;

    // TODO: change this to jquery

    pagecontent = document.getElementsByClassName("pagecontent");
    for (i = 0; i < pagecontent.length; i++) {
        if (pagecontent[i].id != pageName.toString()) {
            pagecontent[i].style.display = "none";
        }
        else {
            pagecontent[i].style.display = "block";
        }
    }
}

function updateLayerCategories(newContent) {
    var selector = $('.air_quality_combobox');

    if (selector.length > 0)
    {
        var additionalHTML = "";

        for (var i = 0; i < newContent.AirQuality.length; i++)
        {
            additionalHTML += "<option><a>" + newContent.AirQuality[i] + "</a></option>";
        }

        selector.html(selector.html() + additionalHTML);
    }
}

function findLayerByID(layerID)
{
    for (var i = 0; i < document.wwd.layers.length; i++)
    {
        if (document.wwd.layers[i].uniqueID && document.wwd.layers[i].uniqueID == layerID)
        {
            return document.wwd.layers[i];
        }
    }
    return null;
}

function showHideLegends(evt, selectedItem, layerID)
{

    if (selectedItem == "info")
    {
        var legends_modal_selector = $("#legends_modal");
        var legends_modal_title = $("#legends_modal_title");
        var legends_modal_text = $("#legends_modal_text");

        var selectedLayer = findLayerByID(layerID);

        legends_modal_title.html(selectedLayer.displayName);
        legends_modal_text.html(selectedLayer.displayName);

        legends_modal_selector.css('display','block');
    }
    else if (selectedItem == "view")
    {

    }
    else if (selectedItem == "delete")
    {

    }
    else if (selectedItem == "toggle_hide")
    {
        var card_content = $("#card_content_"+layerID);

        if (card_content.css('display') != "none")
        {
            card_content.css('display','none');
        }
        else {
            card_content.css('display','unset');
        }
    }
    else if (selectedItem == "no_legends_toggle_hide")
    {
        var no_legend_content = $("#no_legends_content");

        if (no_legend_content.css('display') != "none")
        {
            no_legend_content.css('display','none');
        }
        else {
            no_legend_content.css('display','unset');
        }
    }
}

requirejs(['../../src/WorldWind', './MyLayerManager'],
    function (ww, LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

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


        var basic_layers = [{layer: new WorldWind.BMNGLandsatLayer(), enabled: true}];

        for (var l = 0; l < basic_layers.length; l++) {
            basic_layers[l].layer.enabled = basic_layers[l].enabled;
            wwd.addLayer(basic_layers[l].layer);
        }

        var lightLocation = new WorldWind.Position(45, 190, 0);
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        atmosphereLayer.lightLocation = lightLocation;
        wwd.addLayer(atmosphereLayer);

        var layerManager = new LayerManager(wwd);

        layerManager.createProjectionList();

        var projectionLinker = $("#projectionDropdown");

        projectionLinker.find(" li").on("click", function (e) {
            layerManager.onProjectionClick(e);
        });

        projectionLinker.find("button").css({"backgroundColor": "#337ab7"});
        projectionLinker.find("button").css({"border": "none"})

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

        try {
            $.get(dem_url,
                function (dem_response) {
                    digital_elevation_model_capabilities = new WorldWind.WmsCapabilities(dem_response);
                }
            ).done(function () {
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

        try {
            $.get(gibs_url, function (gibs_response) {
                gibs_wmts_capabilities = new WorldWind.WmtsCapabilities(gibs_response);
            }).done(function () {
                var gibs_data = [];

                var sorting_gibs_data = {"AirQuality": [], "AshPlumes": [], "Drought": [], "DustStorms": []};
                var additionalContent = {};

                function GIBS_recursive(section) {
                    if (section.layer && section.layer.length > 0) {
                        for (var i = 0; i < section.layer.length; i++) {
                            GIBS_recursive(section.layer[i]);
                        }
                    }
                    else {
                        if (section.title && section.title != "") {
                            var gibs_layer
                                = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
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
                    for (var k = 0; k < sorting_gibs_data.length; k++)
                    {
                        if (sorting_gibs_data[k].indexOf(gibs_data[j]) > -1)
                        {
                            // TODO: finish this stuff
                        }
                    }
                }
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
            $("#layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

        try {
            $.get(esa_url, function (esa_response) {
                esa_wmts_capabilities = new WorldWind.WmtsCapabilities(esa_response);
            }).done(function () {
                var esa_data = [];

                function ESA_recursive(section) {
                    if (section.layer && section.layer.length > 0) {
                        for (var i = 0; i < section.layer.length; i++) {
                            ESA_recursive(section.layer[i]);
                        }
                    }
                    else {
                        if (section.title && section.title != "") {
                            var esa_layer
                                = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
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
                    html_layers += "<option><a >" + esa_data[k] + "</a></option>";
                }
                html_layers += "</select></label>";

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
            $("#esa_layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

        try {
            $.get(geomet_url, function (geomet_response) {
                geomet_wms_capabilities = new WorldWind.WmsCapabilities(geomet_response);
            }).done(function () {
                var geomet_data = [];

                function GEOMET_recursive(section) {
                    if (section.layers && section.layers.length > 0) {
                        for (var i = 0; i < section.layers.length; i++) {
                            GEOMET_recursive(section.layers[i]);
                        }
                    }
                    else {
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
                for (var n = 0; n < geomet_data.length; n++) {
                    html_layers += "<option><a >" + geomet_data[n] + "</a></option>";
                }
                html_layers += "</select></label>";

                var geomet_layers_options = $("#geomet_layers_options");

                geomet_layers_options.html(html_layers);

                $('.geomet_combobox').combobox();

                geomet_layers_options.find("select").on("change", function (e) {
                    layerManager.onGEOMETLayerClick(e);
                });

            });
        }
        catch (error) {
            console.log(error);
            $("#geomet_layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

        try {
            $.get(noaa_url, function (noaa_response) {
                noaa_wms_capabilities = new WorldWind.WmsCapabilities(noaa_response);
            }).done(function () {
                var noaa_data = [];

                function NOAA_recursive(section) {
                    if (section.layers && section.layers.length > 0) {
                        for (var i = 0; i < section.layers.length; i++) {
                            NOAA_recursive(section.layers[i]);
                        }
                    }
                    else {
                        if (section.title && section.title != "") {
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
            $("#noaa_layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

        try {
            $.get(ecmwf_url, function (esa_response) {
                ecmwf_wms_capabilities = new WorldWind.WmsCapabilities(esa_response);
            }).done(function () {
                var ecmwf_data = [];

                function ECMWF_recursive(section) {
                    if (section.layers && section.layers.length > 0) {
                        for (var i = 0; i < section.layers.length; i++) {
                            ECMWF_recursive(section.layers[i]);
                        }
                    }
                    else {
                        if (section.title && section.title != "") {
                            var ecmwf_layer
                                = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section));
                            ecmwf_layer.enabled = false;
                            wwd.addLayer(ecmwf_layer);
                            ecmwf_data.push(ecmwf_layer.displayName);
                        }
                    }
                }

                ECMWF_recursive(ecmwf_wms_capabilities.capability);

                // ECMWF html layers
                var html_layers = "<label><select class=\"ecmwf_combobox explorer_combobox\"><option></option>";
                for (var r = 0; r < ecmwf_data.length; r++) {
                    html_layers += "<option><a >" + ecmwf_data[r] + "</a></option>";
                }
                html_layers += "</select></label>";

                var ecmwf_layers_options = $("#ecmwf_layers_options");

                ecmwf_layers_options.html(html_layers);

                $('.ecmwf_combobox').combobox();

                ecmwf_layers_options.find("select").on("change", function (e) {
                    layerManager.onECMWFLayerClick(e);
                });

            });
        }
        catch (error) {
            console.log(error);
            $("#ecmwf_layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

        try {
            $.get(neo_url, function (neo_response) {
                neo_wms_capabilities = new WorldWind.WmsCapabilities(neo_response);
            }).done(function () {
                var neo_data = [];

                function NEO_recursive(section) {
                    if (section.layers && section.layers.length > 0) {
                        for (var i = 0; i < section.layers.length; i++) {
                            NEO_recursive(section.layers[i]);
                        }
                    }
                    else {
                        if (section.title && section.title != "") {
                            var neo_layer
                                = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section));
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
                for (var p = 0; p < neo_data.length; p++) {
                    html_layers += "<option><a >" + neo_data[p] + "</a></option>";
                }
                html_layers += "</select></label>";

                var neo_layers_options = $("#neo_layers_options");

                neo_layers_options.html(html_layers);

                $('.neo_combobox').combobox();

                neo_layers_options.find("select").on("change", function (e) {
                    layerManager.onNEOLayerClick(e);
                });
            });
        }
        catch (error) {
            console.log(error);
            $("#neo_layers_options").html("<img src=\"notification_error.png\" style=\"width: 25%\"/>");
        }

    });

