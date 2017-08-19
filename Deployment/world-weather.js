/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

$(document).ready(function () {
    window.setInterval(function () {
        periods_in_minutes = [];
        if (document.wwd && document.wwd.layers) {
            for (var i = 0; i < document.wwd.layers.length; i++) {
                var layer = document.wwd.layers[i];
                if (layer.enabled && !layer.isBaseLayer) {
                    if (layer.layerType == "WMS" && layer.timeSequence && layer.timeSequence.period) {
                        var additional_minutes = 0;
                        var p = layer.timeSequence.period;

                        additional_minutes += p[6] / 60 + p[5] + p[4] * 60 + p[3] * 60 * 24 +
                            p[2] * 60 * 24 * 30 + p[1] * 60 * 24 * 30 + p[0] * 60 * 24 * 30 * 12;

                        periods_in_minutes.push(additional_minutes);

                    } else if (layer.layerType == "WMTS") {
                        periods_in_minutes.push(60 * 24);
                    }
                }
            }
            document.maximum_period = Math.max.apply(Math, periods_in_minutes);
        }
    }, 5000);

    // this global variable decides the amount of resolution each tile gets
    // the higher the number is, the less resolution each tile has
    // the default number for this tile is 1.75 (this is what WWW originally had)
    document.globalDetailControl = 1.5;

    var tutorial_completed = readCookie('world-weather-tutorial-completed');
    if (tutorial_completed) tutorialCloseButton();

    // enable all tooltips except on touchscreens
    function isTouchDevice() {
        return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    }

    if (isTouchDevice() === false) {
        $('[data-toggle="tooltip"]').tooltip({delay: {"show": 1000, "hide": 100}});
    }

    // Fixed location to be used as light-source for the atmosphere layer
    var FixedLocation = function (wwd) {
        this._wwd = wwd;
    };

    FixedLocation.prototype = Object.create(WorldWind.Location.prototype);

    // Generate fixed location in space for the "Sun"
    Object.defineProperties(FixedLocation.prototype, {
        latitude: {
            get: function () {
                return WorldWind.Location.greatCircleLocation(
                    this._wwd.navigator.lookAtLocation,
                    -70,
                    1.1,
                    new WorldWind.Location()
                ).latitude;
            }
        },
        longitude: {
            get: function () {
                return WorldWind.Location.greatCircleLocation(
                    this._wwd.navigator.lookAtLocation,
                    -70,
                    1.1,
                    new WorldWind.Location()
                ).longitude;
            }
        }
    });

    // This line turns off all warnings that come out of WWW. Turn this back on if
    // you want to do some debugging, but please always keep it off when deploying.
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

    var wwd = new WorldWind.WorldWindow("canvasOne");
    document.wwd = wwd;

    // Initialize the WWW window to a certain altitude, and to the current location of the user
    var screenAvailWidth = window.innerWidth, screenAvailHeight = window.innerHeight;
    wwd.navigator.lookAtLocation.altitude = 0;
    if (screenAvailWidth > screenAvailHeight) {
        wwd.navigator.range = 2.94e7;
    } else {
        wwd.navigator.range = 0.95e7;
    }

    document.smallScreenSize = false;
    if (screenAvailWidth < 840) {
        document.smallScreenSize = true;
        $('.large-tab-text').css('display', 'none');
        $('.small-tab-icon').css('display', 'block');
    }
    else {
        $('.large-tab-text').css('display', 'block');
        $('.small-tab-icon').css('display', 'none');
    }

    $(window).resize(function () {
        if (!document.smallScreenSize && window.innerWidth < 840) {
            document.smallScreenSize = true;
            $('.large-tab-text').css('display', 'none');
            $('.small-tab-icon').css('display', 'block');
        }
        else if (document.smallScreenSize && window.innerWidth >= 840) {
            document.smallScreenSize = false;
            $('.large-tab-text').css('display', 'block');
            $('.small-tab-icon').css('display', 'none');
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (location) {
            wwd.navigator.lookAtLocation.latitude = location.coords.latitude;
            wwd.navigator.lookAtLocation.longitude = location.coords.longitude;
        });
    }
    wwd.redraw();
    // End of initialization



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

    // Single layer from NOAA to become a base layer
    var dem_url = 'https://gis.ngdc.noaa.gov/arcgis/services/dem_hillshades/ImageServer/WMSServer?request=GetCapabilities&service=WMS';

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

            try {
                var digital_elevation_layer =
                    new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(digital_elevation_model_capabilities.capability.layers[0]));
                digital_elevation_layer.displayName = "Digital Elevation Model";
            } catch (error) {
                console.log("Digital elevation layer failed to load from target server.");
                var digital_elevation_layer = null;
            }

            document.viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
            document.viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.02, WorldWind.OFFSET_FRACTION, 0);
            document.viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.02, WorldWind.OFFSET_FRACTION, 0);
            document.viewCoordinatesLayer = new WorldWind.CoordinatesDisplayLayer(wwd);

            var layers = [];
            layers.push(
                {layer: document.viewCoordinatesLayer, enabled: true},
                {layer: document.viewControlsLayer, enabled: true},
                {layer: digital_elevation_layer, enabled: false, layerSelected: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(), enabled: false, layerSelected: true},
                {layer: new WorldWind.BMNGLayer(), enabled: true}
            );

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                if ('layerSelected' in layers[l]) layers[l].layer.layerSelected = layers[l].layerSelected;
                layers[l].layer.isBaseLayer = true;
                wwd.addLayer(layers[l].layer);
            }

            // The code below creates the AtmosphereLayer
            var atmosphereLayer = new WorldWind.AtmosphereLayer();
            atmosphereLayer.isBaseLayer = true;
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

    retrieval_of_data();

    setTimeout(function () {
        $("#loading_modal").fadeOut();
    }, 2000);
});
