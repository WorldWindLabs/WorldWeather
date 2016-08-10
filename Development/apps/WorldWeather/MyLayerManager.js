/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

"use strict";

/**
 * Constructs a layer manager for a specified {@link WorldWindow}.
 * @alias LayerManager
 * @constructor
 * @classdesc Provides a layer manager to interactively control layer visibility for a World Window.
 * @param {WorldWindow} worldWindow The World Window to associated this layer manager with.
 */
var LayerManager = function (worldWindow) {
    var thisExplorer = this;

    this.wwd = worldWindow;

    document.numberOfLegends = 0;

    this.roundGlobe = this.wwd.globe;

    this.createLayerList();

    this.synchronizeLayerList();

    $("#searchBox").find("button").on("click", function (e) {
        thisExplorer.onSearchButton(e);
    });

    this.geocoder = new WorldWind.NominatimGeocoder();
    this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
    $("#searchText").on("keypress", function (e) {
        thisExplorer.onSearchTextKeyPress($(this), e);
    });
};

LayerManager.prototype.onProjectionClick = function (event) {
    var projectionName = event.target.innerText || event.target.innerHTML;
    $("#projectionDropdown").find("button").html(projectionName + ' <span class="caret"></span>');


    if (projectionName === "3D") {
        if (!this.roundGlobe) {
            this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
        }

        if (this.wwd.globe !== this.roundGlobe) {
            this.wwd.globe = this.roundGlobe;
        }
    }
    else {
        if (!this.flatGlobe) {
            this.flatGlobe = new WorldWind.Globe2D();
        }

        if (projectionName === "Equirectangular") {
            this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
        }
        else if (projectionName === "Mercator") {
            this.flatGlobe.projection = new WorldWind.ProjectionMercator();
        }
        else if (projectionName === "North Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
        }
        else if (projectionName === "South Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
        }
        else if (projectionName === "North UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
        }
        else if (projectionName === "South UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
        }
        else if (projectionName === "North Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
        }
        else if (projectionName === "South Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
        }

        if (this.wwd.globe !== this.flatGlobe) {
            this.wwd.globe = this.flatGlobe;
        }
    }

    this.wwd.redraw();
};

LayerManager.prototype.onLayerClick = function (layerButton) {
    var identifier = layerButton.attr("identifier");

    var layer = this.wwd.layers[identifier];
    layer.layerSelected = true;
    layer.enabled = !layer.enabled;
    if (layer.enabled) {
        layerButton.addClass("active");
    }
    else {
        layerButton.removeClass("active");
    }
    this.wwd.redraw();
};

LayerManager.prototype.createLayerList = function () {

};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

LayerManager.prototype.onNASALayerClick = function (event) {
    var layerName = $("#layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
    $("layers_options").toggle();
};

LayerManager.prototype.onESALayerClick = function (event) {
    var layerName = $("#esa_layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onGEOMETLayerClick = function (event) {
    var layerName = $("#geomet_layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onNOAALayerClick = function (event) {
    var layerName = $("#noaa_layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onECMWFLayerClick = function (event) {
    var layerName = $("#ecmwf_layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onNEOLayerClick = function (event) {
    var layerName = $("#neo_layers_options").find("input")[0].defaultValue;
    if (layerName != "") {
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                $("#noLegends").css('display', 'none');

                document.numberOfLegends += 1;

                var placeholder = $("#legend_placeholder");
                var legendAdditions = '<div class="card is-fullwidth" id="' + layer.uniqueID + '"><header class="card-header"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<a class="card-header-icon" onclick="showHideLegends(event, \'toggle_hide\', \''+ layer.uniqueID +'\')"><i class="fa fa-angle-down"></i></a></header>';
                legendAdditions += '<span id="card_content_'+ layer.uniqueID +'"><div class="card-content" "><div class="content"><br/><br/>';

                if (layer.legend) {
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" /><br/><br/>";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.<br/><br/>";
                }

                if (layer.currentTimeString) {
                    legendAdditions += '<small>' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'view\', \''+ layer.uniqueID +'\')">View</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'info\', \''+ layer.uniqueID +'\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, \'delete\', \''+ layer.uniqueID +'\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/>';

                placeholder.html(placeholder.html() + legendAdditions);

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onLayerDelete = function (e) {
    var identifier = e.attr("identifier");

    var layer = this.wwd.layers[identifier];

    var uniqueSelector = $("#" + layer.uniqueID);
    if (uniqueSelector.length) {
        uniqueSelector.remove();
    }

    var legend_selector = $("#legend_placeholder");

    document.numberOfLegends -= 1;

    if (document.numberOfLegends == 0) {
        $("#noLegends").css('display', 'block');

    }

    layer.enabled = false;
    layer.layerSelected = false;

    this.synchronizeLayerList();
    this.wwd.redraw();
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

LayerManager.prototype.synchronizeLayerList = function () {
    var layerListItem = $("#layerList");

    if (!document.isInitialized) {

        document.isInitialized = 0;
    }

    layerListItem.find("button").remove();

    var self = this;

    // Synchronize the displayed layer list with the World Window's layer list.
    for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        var layer = this.wwd.layers[i];

        if (layer.hide) {
            continue;
        }

        if (layer.displayName == "Coordinates" || layer.displayName == "View Controls") {

            if (document.isInitialized < 2) {

                var controllayerItem = $('<button class="list-group-item btn btn-block" identifier="' + i + '">' + layer.displayName + '</button>');
                var controlItem = $("#controlbuttons");
                controlItem.append(controllayerItem);

                controllayerItem.find("span").on("click", function (e) {
                    self.onLayerDelete($(this));
                });

                controllayerItem.on("click", function (e) {
                    self.onLayerClick($(this));
                });

                if (layer.enabled) {
                    controllayerItem.addClass("active");
                }

                document.isInitialized += 1;
            }
        }

        else if (layer.enabled || layer.layerSelected) {
            var toDisplay = layer.displayName;
            if (toDisplay == "dem_hillshades") {
                toDisplay = "Digital Elevation Model";
            }

            if (toDisplay.length > 25) {
                toDisplay = toDisplay.substr(0, 25) + "...";
            }

            var baseLayers = ["Digital Elevation Model", "Blue Marble & Landsat", "Atmosphere", "Bing Aerial with Labels"];

            if (baseLayers.indexOf(toDisplay) > -1) {
                var layerItem = $('<button class="list-group-item btn btn-block" identifier="' + i + '">' + toDisplay + '</button>');
            }
            else {
                var layerItem = $('<button class="list-group-item btn btn-block" identifier="' + i + '"><span class="glyphicon glyphicon-remove pull-right" identifier="' + i + '"></span>' + toDisplay + '</button>');
            }
            layerListItem.append(layerItem);

            layerItem.find("span").on("click", function (e) {
                self.onLayerDelete($(this));
            });

            layerItem.on("click", function (e) {
                self.onLayerClick($(this));
            });

            if (layer.enabled) {
                layerItem.addClass("active");
            }
        }
    }

    $("#count").text("Selected layers (" + layerListItem.find("button").length + ")");
};

LayerManager.prototype.createProjectionList = function () {
    var projectionNames = [
        "3D",
        "Equirectangular",
        "Mercator",
        "North Polar",
        "South Polar",
        "North UPS",
        "South UPS",
        "North Gnomonic",
        "South Gnomonic"
    ];
    var projectionDropdown = $("#projectionDropdown");

    var dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">3D<span class="caret"></span></button>');
    projectionDropdown.append(dropdownButton);

    var ulItem = $('<ul class="dropdown-menu">');
    projectionDropdown.append(ulItem);

    for (var i = 0; i < projectionNames.length; i++) {
        var projectionItem = $('<li><a >' + projectionNames[i] + '</a></li>');
        ulItem.append(projectionItem);
    }

    ulItem = $('</ul>');
    projectionDropdown.append(ulItem);
};

LayerManager.prototype.onSearchButton = function (event) {
    this.performSearch($("#searchText")[0].value)
};

LayerManager.prototype.onSearchTextKeyPress = function (searchInput, event) {
    if (event.keyCode === 13) {
        searchInput.blur();
        this.performSearch($("#searchText")[0].value)
    }
};

LayerManager.prototype.performSearch = function (queryString) {
    if (queryString) {
        var thisLayerManager = this,
            latitude, longitude;

        if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
            var tokens = queryString.split(",");
            latitude = parseFloat(tokens[0]);
            longitude = parseFloat(tokens[1]);
            thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
        }
        else {
            this.geocoder.lookup(queryString, function (geocoder, result) {
                if (result.length > 0) {
                    latitude = parseFloat(result[0].lat);
                    longitude = parseFloat(result[0].lon);

                    WorldWind.Logger.log(
                        WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                    thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                }
            });
        }
    }
};