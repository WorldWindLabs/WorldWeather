/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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

    //make sure none of the "view"s on the legends are selected
    var footer_content = document.getElementsByClassName("card-footer-item");
    for (var i = 0; i < footer_content.length; i++) footer_content[i].childNodes[0].innerHTML = "View";
    document.global_view_layers = [];
    //end of section

    var identifier = layerButton.attr("identifier");
    var layer = this.wwd.layers[identifier];
    layer.layerSelected = true;
    layer.enabled = !layer.enabled;

    if (layer.enabled) layerButton.addClass("active");
    else layerButton.removeClass("active");

    this.synchronizeLayerList();
    this.wwd.redraw();
};

LayerManager.prototype.createLayerList = function () {

};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

LayerManager.prototype.onDataLayerClick = function (event, jquery_layer_options) {

    var layerName = $("#" + jquery_layer_options).find("input")[0].defaultValue;
    if (layerName != "") {
        var title_selector = $("#" + jquery_layer_options + "_title");
        var layerNum = parseInt(title_selector.html());
        layerNum += 1;
        title_selector.html(layerNum);

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
                var legendAdditions = '<div id="' + layer.uniqueID + '"><div class="card is-fullwidth" >';
                legendAdditions += '<header class="card-header" onclick="showHideLegends(event, this, \'toggle_hide\', \'' + layer.uniqueID + '\')"><p class="card-header-title">';
                legendAdditions += layer.shortDisplayName + '</p>';
                legendAdditions += '<div class="card-header-icon" ><i class="fa fa-angle-down"></i></div></header>';
                legendAdditions += '<span id="card_content_' + layer.uniqueID + '"><div class="card-content" "><div class="content">';

                if (layer.legend) {
                    legendAdditions += '<p style="font-weight: bold; font-size: small; text-align: center">Legend</p>';
                    legendAdditions += "<img style=\" max-width: 100%; max-height: 200px \" src=\"" + layer.legend + "\" />";
                }
                else {
                    legendAdditions += "No legend was provided for this layer by the data source.";
                }

                legendAdditions += '<hr><div style="font-weight: bold; font-size: small; text-align: center">Date and Time</div>';
                if (layer.time && layer.timeSequence) {
                    layer.time = layer.timeSequence.endTime;
                    layer.timeSequence.currentTime = layer.time;
                    legendAdditions += '<div style="font-weight: bold" class="ui-slider" id="datetime_slider_' + layer.uniqueID + '"></div>';
                    legendAdditions += '<p type="text" id="amount' + layer.uniqueID + '" style="font-size: small"></p>';
                }
                else {
                    legendAdditions += '<small style="font-size: small" id="legend_time_' + layer.uniqueID + '">' + layer.currentTimeString + '</small>';
                }

                legendAdditions += '<hr><div style="font-weight: bold; font-size: small; text-align: center">Opacity</div>';
                legendAdditions += '<div class="ui-slider" id="opacity_slider_' + layer.uniqueID + '"></div>';
                legendAdditions += '<div type="text" id="opacity_amount_' + layer.uniqueID + '" style="font-size: small">100%</div>';


                legendAdditions += '</div></div><footer class="card-footer">';
                legendAdditions += '<div class="card-footer-item" id= \'' + layer.uniqueID + '\' onclick="showHideLegends(event, this,  \'view\', \'' + layer.uniqueID + '\')"><a href="#" >View</a></div>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, this, \'info\', \'' + layer.uniqueID + '\')">Info</a>';
                legendAdditions += '<a class="card-footer-item" onclick="showHideLegends(event, this,\'delete\', \'' + layer.uniqueID + '\')">Delete</a>';
                legendAdditions += '</footer></span></div><br/><br/></div>';

                placeholder.append(legendAdditions);

                var datetime_selector = $("#datetime_slider_" + layer.uniqueID);
                var amount_selector = $("#amount" + layer.uniqueID);

                if (datetime_selector.length > 0) {

                    var time_delta = WorldWind.PeriodicTimeSequence.incrementTime(new Date(0), layer.timeSequence.period);
                    datetime_selector.slider({
                        value: layer.timeSequence.endTime.getTime(),
                        min: layer.timeSequence.startTime.getTime(),
                        max: layer.timeSequence.endTime.getTime(),
                        step: time_delta.getTime()
                    });
                    var options = {
                        weekday: "short", year: "numeric", month: "short",
                        day: "numeric", hour: "2-digit", minute: "2-digit"
                    };
                    datetime_selector.on("slide", function (event, ui) {
                        amount_selector.html(new Date(ui.value).toLocaleTimeString("en-us", options));
                    });
                    datetime_selector.on("slidestop", function (event, ui) {
                        var new_datetime = new Date(ui.value);
                        alterWmsLayerTime(event, layer.uniqueID, new_datetime);
                    });
                    amount_selector.html(new Date(datetime_selector.slider("value")).toLocaleTimeString("en-us", options));
                }

                var opacity_selector = $("#opacity_slider_" + layer.uniqueID);
                var opacity_amount_selector = $("#opacity_amount_" + layer.uniqueID);

                if (opacity_selector.length > 0) {
                    opacity_selector.slider({
                        value: 1,
                        min: 0,
                        max: 1,
                        step: 0.1
                    });
                    opacity_selector.on("slide", function (event, ui) {
                        opacity_amount_selector.html(ui.value * 100 + "%");
                    });
                    opacity_selector.on("slidestop", function (event, ui) {
                        layer.opacity = ui.value;
                        document.wwd.redraw();
                    });

                }

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                this.wwd.layers[i].sourceLayersOptions = jquery_layer_options;
                console.log(this.wwd.layers[i]);
                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    }
};

LayerManager.prototype.onLayerDelete = function (e, layerID) {
    var layer = null;

    if (e) layer = this.wwd.layers[e.attr("identifier")];
    else layer = findLayerByID(layerID);

    console.log(layer);
    var layersTitle = $("#" + layer.sourceLayersOptions + "_title");
    var layerNumber = parseInt(layersTitle.html());
    console.log(layer.sourceLayersOptions);
    layerNumber --;
    layersTitle.html(layerNumber);

    var uniqueSelector = $("#" + layer.uniqueID);
    if (uniqueSelector.length) uniqueSelector.remove();

    document.numberOfLegends -= 1;
    if (document.numberOfLegends == 0) $("#noLegends").css('display', 'block');

    layer.enabled = false;
    layer.layerSelected = false;
    this.synchronizeLayerList();

    // make sure none of the "view"s on the legends are selected
    var footer_content = document.getElementsByClassName("card-footer-item");
    for (var i = 0; i < footer_content.length; i++) footer_content[i].childNodes[0].innerHTML = "View";
    document.global_view_layers = [];
    //end of section

    this.wwd.redraw();
};

LayerManager.prototype.onLayerMoveDown = function (e) {

    //make sure none of the "view"s on the legends are selected
    var footer_content = document.getElementsByClassName("card-footer-item");
    for (var a = 0; a < footer_content.length; a++) {
        footer_content[a].childNodes[0].innerHTML = "View";
    }
    document.global_view_layers = [];
    //end of section

    var identifier = parseInt(e.attr("identifier"));
    for (var i = identifier + 1; i < this.wwd.layers.length; i++) {
        if (this.wwd.layers[i].enabled || this.wwd.layers[i].layerSelected) {
            this.wwd.layers.move(identifier, i);
            break;
        }
    }

    this.wwd.redraw();
    this.synchronizeLayerList();
};

LayerManager.prototype.onLayerMoveUp = function (e) {

    //make sure none of the "view"s on the legends are selected
    var footer_content = document.getElementsByClassName("card-footer-item");
    for (var a = 0; a < footer_content.length; a++) {
        footer_content[a].childNodes[0].innerHTML = "View";
    }
    document.global_view_layers = [];
    //end of section

    var identifier = parseInt(e.attr("identifier"));
    for (var i = identifier -1 ; i > 0; i--) {
        if (this.wwd.layers[i].enabled || this.wwd.layers[i].layerSelected) {
            this.wwd.layers.move(identifier, i);
            break;
        }
    }

    this.wwd.redraw();
    this.synchronizeLayerList();
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

    layerListItem.find("div").remove();

    var self = this;

    // Synchronize the displayed layer list with the World Window's layer list.
    for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        var layer = this.wwd.layers[i];

        if (layer.hide) {
            continue;
        }

        if (layer.displayName == "Coordinates" || layer.displayName == "View Controls") {

            if (document.isInitialized < 2) {

                var controllayerItem = $('<div class="list-group-item btn btn-block" identifier="' + i + '">' + layer.displayName + '</div>');
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

            var baseLayers = ["Digital Elevation Model", "Blue Marble & Landsat", "Atmosphere", "Bing Aerial with Labels"];

            if (baseLayers.indexOf(toDisplay) == -1) {
                if (toDisplay.length > 25) {
                    toDisplay = toDisplay.substr(0, 25) + "...";
                }
            }

            var layerItem = null;
            if (baseLayers.indexOf(toDisplay) > -1) {
                layerItem = $('<div class="list-group-item btn btn-block" identifier="' + i + '">' + toDisplay + '</div>');
            }
            else {
                layerItem = $('<div class="list-group-item btn btn-block" identifier="' + i + '"><span id="delete_icon_' + i + '" class="glyphicon glyphicon-remove pull-right" identifier="' + i + '"></span><span id="down_icon_' + i + '" class="glyphicon glyphicon-triangle-bottom pull-left" identifier="' + i + '"></span><span id="up_icon_' + i + '" class="glyphicon glyphicon-triangle-top pull-left" identifier="' + i + '"></span><span style="display:inline-block; width: 2px;"></span>' + toDisplay + '</div>');
            }
            layerListItem.append(layerItem);

            $('#delete_icon_' + i).on("click", function (e) {
                self.onLayerDelete($(this));
            });

            $('#down_icon_' + i).on("click", function (e) {
                self.onLayerMoveDown($(this));
            });

            $('#up_icon_' + i).on("click", function (e) {
                self.onLayerMoveUp($(this));
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
            thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude), null);
        }
        else {
            this.geocoder.lookup(queryString, function (geocoder, result) {
                if (result.length > 0) {
                    latitude = parseFloat(result[0].lat);
                    longitude = parseFloat(result[0].lon);

                    WorldWind.Logger.log(
                        WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                    thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude), null);
                }
            });
        }
    }
};