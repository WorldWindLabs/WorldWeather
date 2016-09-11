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
    var wwd_duplicate = [new WorldWind.WorldWindow("canvasTwo"),
        new WorldWind.WorldWindow("canvasThree"),
        new WorldWind.WorldWindow("canvasFour")];

    wwd.isLeftGlobe = true;
    wwd_duplicate[0].isLeftGlobe = false;
    wwd_duplicate[1].isLeftGlobe = false;
    wwd_duplicate[2].isLeftGlobe = false;

    wwd_duplicate[0].numberOfDuplicateGlobe = 1;
    wwd_duplicate[1].numberOfDuplicateGlobe = 2;
    wwd_duplicate[2].numberOfDuplicateGlobe = 3;

    wwd.navigator.numberOfDuplicateGlobe = 0;
    wwd_duplicate[0].navigator.numberOfDuplicateGlobe = 1;
    wwd_duplicate[1].navigator.numberOfDuplicateGlobe = 2;
    wwd_duplicate[2].navigator.numberOfDuplicateGlobe = 3;

    document.wwd = wwd;
    document.wwd_duplicate = wwd_duplicate;

    // Initialize the WWW window to a certain altitude, and to the current location of the user
    var screenAvailWidth = window.innerWidth, screenAvailHeight = window.innerHeight;
    wwd.navigator.lookAtLocation.altitude = 0;
    if (screenAvailWidth > screenAvailHeight)
        wwd.navigator.range = 0.4e8;
    else
        wwd.navigator.range = 0.9e7;

    wwd_duplicate.forEach(function(element, index, array)
    {
        element.navigator.range = wwd.navigator.range;
    });

    if (screenAvailWidth < 840) {
        // TODO: change the tab buttons + hide the view controls automatically
    }

    document.smallScreenSize = false;
    if (screenAvailWidth < 840) {
        document.smallScreenSize = true;
        $('.large-tab-text').css('display','none');
        $('.small-tab-icon').css('display','block');
    }
    else {
        $('.large-tab-text').css('display','block');
        $('.small-tab-icon').css('display','none');
    }

    $(window).resize(function () {
        if (!document.smallScreenSize && window.innerWidth < 840)
        {
            document.smallScreenSize = true;
            $('.large-tab-text').css('display','none');
            $('.small-tab-icon').css('display','block');
        }
        else if (document.smallScreenSize && window.innerWidth >= 840)
        {
            document.smallScreenSize = false;
            $('.large-tab-text').css('display','block');
            $('.small-tab-icon').css('display','none');
        }
    });

    document.wwd_original_navigator = wwd.navigator;
    document.wwd_duplicated_navigator = [wwd_duplicate[0].navigator, wwd_duplicate[1].navigator, wwd_duplicate[2].navigator];

    document.wwd_duplicated_navigator.forEach(function (element, index, array){
        element.isForDuplicateGlobe = true;
    });


    // Legends Modal Setup Functions
    var legends_modal_button = $('#legends_modal_delete_button');
    legends_modal_button.on("click", function (e) {
        var legends_modal_selector = $("#legends_modal");
        legends_modal_selector.css('display', 'none');
    });
    // End of Legends Modal code

    var layerManager = new LayerManager(wwd, wwd_duplicate);
    document.layerManager = layerManager;
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
                if (document.wwd_duplicate) {
                    if (!(document.wwd_duplicate instanceof Array)) {
                        document.wwd_duplicate.addLayer(layers[l].layer);
                    }
                    else {
                        document.wwd_duplicate.forEach(function(element, index, array){
                            element.addLayer(layers[l].layer);
                        });
                    }
                }
            }

            var coordinates_layer = new WorldWind.CoordinatesDisplayLayer(wwd);
            coordinates_layer.enabled = true;
            coordinates_layer.isBaseLayer = true;
            wwd.addLayer(coordinates_layer);

            // The code below creates the AtmosphereLayer
            var atmosphereLayer = new WorldWind.AtmosphereLayer();
            atmosphereLayer.isBaseLayer = true;
            wwd.addLayer(atmosphereLayer);
            if (document.wwd_duplicate) {
                if (!(document.wwd_duplicate instanceof Array)) {
                    document.wwd_duplicate.addLayer(atmosphereLayer);
                }
                else {
                    document.wwd_duplicate.forEach(function(element, index, array){
                        element.addLayer(atmosphereLayer);
                    });
                }
            }
            // end of AtmosphereLayer

            layerManager.synchronizeLayerList();
        });
    }
    catch (error) {
        console.log(error);
    }
    // end of digital elevation model from wms server code

    document.comboboxes = [];

    $('.global_combobox').combobox();
    document.global_combobox_selector = document.comboboxes[0];

    $('#global_layers_options').find("select").on("change", function (e) {
        var layerName = $('#global_layers_options').find("input")[0].defaultValue;
        if (layerName && layerName != "")
        {
            layerManager.onDataLayerClick(null,null,layerName);
        }
    });

    retrieval_of_data();

    setTimeout(function () {
        $("#loading_modal").fadeOut();
    }, 2000);
});
