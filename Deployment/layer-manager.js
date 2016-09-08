/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

var LayerManager = function (worldWindow, worldWindowDuplicated) {
    var thisExplorer = this;

    this.wwd = worldWindow;
    if (document.wwd_duplicate) this.wwd_duplicate = worldWindowDuplicated;

    document.numberOfLegends = 0;

    this.roundGlobe = this.wwd.globe;

    this.createLayerList();

    this.synchronizeLayerList();

    $("#searchBox").find("button").on("click", function (e) {
        thisExplorer.onSearchButton(e);
    });

    this.geocoder = new WorldWind.NominatimGeocoder();
    this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
    if (document.wwd_duplicate) this.goToAnimator_duplicated = new WorldWind.GoToAnimator(this.wwd_duplicate);
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
            if (document.wwd_duplicate) {
                var wwd_globe = this.wwd.globe;
                if (document.wwd_duplicate instanceof Array) {
                    this.wwd_duplicate.forEach(function (element, index, array) {
                        element.globe = wwd_globe;
                    });
                } else {
                    this.wwd_duplicate.globe = wwd_globe;
                }
            }
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
            if (document.wwd_duplicate) {
                this.wwd_duplicate.globe = this.flatGlobe;
                var wwd_globe = this.wwd.globe;
                if (document.wwd_duplicate instanceof Array) {
                    this.wwd_duplicate.forEach(function (element, index, array) {
                        element.globe = wwd_globe;
                    });
                } else {
                    this.wwd_duplicate.globe = wwd_globe;
                }
            }
        }
    }

    this.wwd.redraw();
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            this.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        } else {
            this.wwd_duplicate.redraw();
        }
    }
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

    var baseLayers = ["Digital Elevation Model", "Blue Marble", "Bing Aerial with Labels"];
    if (baseLayers.indexOf(layer.displayName) > -1) {
        for (var k = 0; k < baseLayers.length; k++) {
            if (baseLayers[k] == layer.displayName) continue;
            for (var j = 0; j < this.wwd.layers.length; j++) {
                if (this.wwd.layers[j].displayName == baseLayers[k]) {
                    this.wwd.layers[j].layerSelected = true;
                    this.wwd.layers[j].enabled = false;
                    break;
                }
            }
        }
    }

    if (layer.enabled) layerButton.addClass("active");
    else layerButton.removeClass("active");

    this.synchronizeLayerList();
    this.wwd.redraw();
    if (document.wwd_duplicate) {
        if (!(document.wwd_duplicate instanceof Array)) {
            this.wwd_duplicate.redraw();
        } else {
            this.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        }
    }
};

LayerManager.prototype.createLayerList = function () {

};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

LayerManager.prototype.onDataLayerClick = function (event, jquery_layer_options, passed_layer_name) {
    var layerName;
    if (passed_layer_name) layerName = passed_layer_name;
    else layerName = $("#" + jquery_layer_options).find("input")[0].defaultValue;

    if (layerName != "") {

        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide || layer.enabled) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;

                var layerTagsSelector = $("#" + layer.sourceLayersOptions + "_added_tags");
                var toDisplay = layer.displayName;
                if (toDisplay.length > 7) {
                    toDisplay = toDisplay.substr(0, 7) + "...";
                }

                layerTagsSelector.append('<i class="layer-tag tag is-info" data-toggle="tooltip" title=\'' + layer.displayName + '\' id="layer_tag_' + layer.uniqueID + '">' + toDisplay + '<button class="delete" onclick="onLayerTagDelete(event, \'' + layer.uniqueID + '\')"></button></i>');

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

                legendAdditions += '<hr><div style="font-weight: bold; font-size: small; text-align: center">Date and Time</div><br/>';

                if (layer.time && layer.timeSequence) {
                    layer.time = layer.timeSequence.endTime;
                    layer.timeSequence.currentTime = layer.time;
                    legendAdditions += '<div style="text-align: center; width: 100%">';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'start\')"><i class="play-buttons fa fa-arrow-left" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'big-previous\')"><i class="play-buttons fa fa-angle-double-left" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'previous\')"><i class="play-buttons fa fa-chevron-circle-left" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'play-pause\')"><i class="play-buttons fa fa-play-circle-o" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'next\')"><i class="play-buttons fa fa-chevron-circle-right" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'big-next\')"><i class="play-buttons fa fa-angle-double-right" aria-hidden="true"></i></b>';
                    legendAdditions += '<b onclick="alterWmsLayerTime(event, ' + layer.uniqueID + ', \'end\')"><i class="play-buttons fa fa-arrow-right" aria-hidden="true"></i></b>';
                    legendAdditions += '</div><div style="font-weight: bold" class="ui-slider" id="datetime_slider_' + layer.uniqueID + '"></div>';
                    legendAdditions += '<p type="text" id="amount' + layer.uniqueID + '" style="font-size: small"></p>';
                }
                else if (layer.layerType == "WMTS") {
                    legendAdditions += '<div style="text-align: center; width: 100%">';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'huge-previous\')"><i class="play-buttons fa fa-arrow-left" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'big-previous\')"><i class="play-buttons fa fa-angle-double-left" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'previous\')"><i class="play-buttons fa fa-chevron-circle-left" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'play-pause\')"><i class="play-buttons fa fa-play-circle-o" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'next\')"><i class="play-buttons fa fa-chevron-circle-right" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'big-next\')"><i class="play-buttons fa fa-angle-double-right" aria-hidden="true"></i></b> ';
                    legendAdditions += '<b onclick="moveWmtsLayer(' + layer.uniqueID + ', \'huge-next\')"><i class="play-buttons fa fa-arrow-right" aria-hidden="true"></i></b> ';
                    legendAdditions += '</div><br/><small style="font-size: small" id="legend_time_' + layer.uniqueID + '">' + layer.currentTimeString.toUTCString() + '</small>';
                }
                else if (layer.currentTimeString) {
                    legendAdditions += '<small style="font-size: small" id="legend_time_' + layer.uniqueID + '">' + layer.currentTimeString.toUTCString() + '</small>';
                }
                else {
                    legendAdditions += '<small style="font-size: small">This layer has no time-dimension.</small>';
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

                if (datetime_selector.length > 0) {
                    var time_arrays = layer.timeSequence.produceArrayOfTimes();

                    datetime_selector.slider({
                        value: time_arrays.length - 1,
                        min: 0,
                        max: time_arrays.length - 1,
                        step: 1
                    });

                    var amount_selector = $("#amount" + layer.uniqueID);
                    datetime_selector.on("slide", function (event, ui) {
                        amount_selector.html(time_arrays[ui.value].toUTCString());
                    });
                    datetime_selector.on("slidestop", function (event, ui) {
                        alterWmsLayerTime(event, layer.uniqueID, ui.value);
                    });
                    datetime_selector.on("change", function (event, ui) {
                        alterWmsLayerTime(event, layer.uniqueID, ui.value);
                    });
                    amount_selector.html(time_arrays[time_arrays.length - 1].toUTCString());
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
                        if (document.wwd_duplicate) {
                            if (!(document.wwd_duplicate instanceof Array))
                                document.wwd_duplicate.redraw();
                            else {
                                document.wwd_duplicate.forEach(function (element, index, array) {
                                    element.redraw();
                                });
                            }
                        }
                    });

                }

                this.wwd.layers.move(i, this.wwd.layers.length - 1);
                if (jquery_layer_options) this.wwd.layers[i].sourceLayersOptions = jquery_layer_options;

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

    layer.isOnLeftGlobe = true;

    var layerTagSelector = $("#layer_tag_" + layer.uniqueID);
    if (layerTagSelector.length) layerTagSelector.remove();

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

    if (layer.displayName == "Placemarks") document.placemarkLayer = null;

    this.wwd.redraw();
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            this.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        } else {
            this.wwd_duplicate.redraw();
        }
    }
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
    if (identifier != (this.wwd.layers.length - 1)) {
        for (var i = identifier + 1; i < this.wwd.layers.length; i++) {
            if (this.wwd.layers[i].enabled || this.wwd.layers[i].layerSelected) {
                this.wwd.layers.move(identifier, i);
                break;
            }
        }
    }

    this.wwd.redraw();
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            this.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        } else {
            this.wwd_duplicate.redraw();
        }
    }
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

    var baseLayers = ["Digital Elevation Model", "Blue Marble", "Atmosphere", "Bing Aerial with Labels"];

    var identifier = parseInt(e.attr("identifier"));
    for (var i = identifier - 1; i > 0; i--) {
        if (baseLayers.indexOf(this.wwd.layers[i].displayName) > -1) break;

        if (this.wwd.layers[i].enabled || this.wwd.layers[i].layerSelected) {
            this.wwd.layers.move(identifier, i);
            break;
        }
    }

    this.wwd.redraw();
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            this.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        } else {
            this.wwd_duplicate.redraw();
        }
    }
    this.synchronizeLayerList();
};

LayerManager.prototype.onLayerMoveGlobe = function (e) {
    //make sure none of the "view"s on the legends are selected
    var footer_content = document.getElementsByClassName("card-footer-item");
    for (var a = 0; a < footer_content.length; a++) {
        footer_content[a].childNodes[0].innerHTML = "View";
    }
    document.global_view_layers = [];
    //end of section

    var identifier = parseInt(e.attr("identifier"));

    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            if (!document.wwd.layers[identifier].isOnLeftGlobe) {
                if (document.wwd.layers[identifier].onGlobeNumber == document.wwd_duplicate.length) {
                    document.wwd.layers[identifier].isOnLeftGlobe = true;
                    document.wwd.layers[identifier].onGlobeNumber = 0;
                }
                else {
                    document.wwd.layers[identifier].onGlobeNumber += 1;
                }
            }
            else {
                document.wwd.layers[identifier].onGlobeNumber = 1;
                document.wwd.layers[identifier].isOnLeftGlobe = false;
            }

            document.wwd_duplicate.forEach(function (element, index, array) {
                element.layers = document.wwd.layers;
            });
        } else {
            document.wwd.layers[identifier].isOnLeftGlobe = !document.wwd.layers[identifier].isOnLeftGlobe;
        }
    }

    if (document.wwd_duplicate) document.wwd_duplicate.layers = document.wwd.layers;

    document.wwd.redraw();
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            document.wwd_duplicate.forEach(function (element, index, array) {
                element.redraw();
            });
        } else {
            document.wwd_duplicate.redraw();
        }
    }
    this.synchronizeLayerList();
};

LayerManager.prototype.synchronizeLayerList = function () {
    var layerListItem = $("#layerList");
    var baseLayersListItem = $("#base_layers");
    var layerListItemText = $("#layer_text");

    var duplicateLayersListItem, duplicatelayerListItemText;
    if (document.wwd_duplicate) {
        if (!(document.wwd_duplicate instanceof Array)) {
            duplicateLayersListItem = $("#layerList_duplicate");
            duplicatelayerListItemText = $("#layer_text_duplicate");
            duplicateLayersListItem.find("div").remove();
        }
        else {
            duplicateLayersListItem = [];
            duplicatelayerListItemText = [];
            document.wwd_duplicate.forEach(function (element, index, array) {
                duplicateLayersListItem.push($("#layerList_duplicate_" + index));
                duplicatelayerListItemText.push($("#layer_text_duplicate_" + index));
            });
            duplicateLayersListItem.forEach(function (element, index, array) {
                element.find("div").remove();
            });
        }
    }

    if (!document.isInitialized) document.isInitialized = 0;

    layerListItem.find("div").remove();
    baseLayersListItem.find("div").remove();

    var self = this;
    var left_count = 0;
    var right_count;
    if (document.wwd_duplicate) {
        if (document.wwd_duplicate instanceof Array) {
            right_count = [];
            document.wwd_duplicate.forEach(function () {
                right_count.push(0);
            });
        }
        else {
            right_count = 0;
        }
    } else {
        right_count = 0;
    }

    // Synchronize the displayed layer list with the World Window's layer list.
    for (var i = this.wwd.layers.length - 1; i >= 0; i--) {
        var layer = this.wwd.layers[i];
        if (layer.hide) continue;

        if (layer.displayName == "Coordinates" || layer.displayName == "View Controls") {
            if (!(document.wwd_duplicate)) {
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
        }

        else if (layer.enabled || layer.layerSelected) {
            count += 1;
            var toDisplay = layer.displayName;

            var baseLayers = ["Digital Elevation Model", "Blue Marble", "Atmosphere", "Bing Aerial with Labels"];

            if (baseLayers.indexOf(toDisplay) == -1) {
                if (toDisplay.length > 20) toDisplay = toDisplay.substr(0, 20) + "...";
            }

            var layerItem = null;
            if (baseLayers.indexOf(toDisplay) > -1) {
                layerItem = $('<div style="font-size: 90%" class="list-group-item btn btn-block" identifier="' + i + '">' + toDisplay + '</div>');
                baseLayersListItem.append(layerItem);
            }
            else {
                if (document.wwd_duplicate) {
                    layerItem = $('<div style="font-size: 90%" class="list-group-item btn btn-block" data-toggle="tooltip" title=\'' + layer.displayName + '\' identifier="' + i + '"><span id="delete_icon_' + i + '" class="glyphicon glyphicon-remove pull-right" identifier="' + i + '"></span><span id="down_icon_' + i + '" class="glyphicon glyphicon-triangle-top pull-left" identifier="' + i + '"></span><span id="up_icon_' + i + '" class="glyphicon glyphicon-triangle-bottom pull-left" identifier="' + i + '"></span><span style="margin-left: 5px" id="move_globe_' + i + '" class="fa fa-globe pull-left" identifier="' + i + '"></span><span style="display:inline-block; width: 2px;"></span>' + toDisplay + '</div>');
                }
                else {
                    layerItem = $('<div style="font-size: 90%" class="list-group-item btn btn-block" data-toggle="tooltip" title=\'' + layer.displayName + '\' identifier="' + i + '"><span id="delete_icon_' + i + '" class="glyphicon glyphicon-remove pull-right" identifier="' + i + '"></span><span id="down_icon_' + i + '" class="glyphicon glyphicon-triangle-top pull-left" identifier="' + i + '"></span><span id="up_icon_' + i + '" class="glyphicon glyphicon-triangle-bottom pull-left" identifier="' + i + '"></span><span style="display:inline-block; width: 2px;"></span>' + toDisplay + '</div>');
                }


                if (document.wwd_duplicate) {
                    if (!(document.wwd_duplicate instanceof Array)) {
                        if (layer.isOnLeftGlobe) {
                            layerListItem.append(layerItem);
                            left_count += 1;
                        }
                        else {
                            duplicateLayersListItem.append(layerItem);
                            right_count += 1;
                        }
                    } else {
                        if (layer.isOnLeftGlobe) {
                            layerListItem.append(layerItem);
                            left_count += 1;
                        }
                        else {
                            duplicateLayersListItem[layer.onGlobeNumber - 1].append(layerItem);
                            right_count[layer.onGlobeNumber - 1] += 1;
                        }
                    }
                } else {
                    layerListItem.append(layerItem);
                    left_count += 1;
                }
            }

            $('#delete_icon_' + i).on("click", function (e) {
                self.onLayerDelete($(this));
            });

            $('#down_icon_' + i).on("click", function (e) {
                self.onLayerMoveDown($(this));
            });

            $('#up_icon_' + i).on("click", function (e) {
                self.onLayerMoveUp($(this));
            });

            $('#move_globe_' + i).on("click", function (e) {
                self.onLayerMoveGlobe($(this));
            });

            layerItem.on("click", function (e) {
                self.onLayerClick($(this));
            });

            if (layer.enabled) {
                layerItem.addClass("active");
            }
        }
    }

    $("#count").text("(" + left_count + ")");
    if (document.wwd_duplicate) {
        if (!(document.wwd_duplicate instanceof Array)) {
            $("#count_duplicate").text("(" + right_count + ")");
        } else {
            document.wwd_duplicate.forEach(function (element, index, array) {
                $("#count_duplicate_" + index).text("(" + right_count[index] + ")");
            });
        }
    }

    if (left_count == 0) {
        if (document.wwd_duplicate) {
            layerListItemText.html('<p style="color: white">Please add a layer from the Available Layers tab. Layers that you add will initially show up here and you can transfer them between globes later.</p>');
        } else {
            layerListItemText.html('<p style="color: white">Please add a layer from the Available Layers tab. Layers that you add will be show up here in a descending order (highest to lowest).</p>');
        }
    }
    else {
        layerListItemText.html("");
    }

    if (document.wwd_duplicate) {
        if (!(document.wwd_duplicate instanceof Array)) {
            if (right_count == 0) {
                duplicatelayerListItemText.html('<p style="color: white">To move a layer from the left globe to the right globe, click on the small globe icon and that layer will switch between globes.</p>');
            }
            else {
                duplicatelayerListItemText.html("");
            }
        }
        else {
            duplicatelayerListItemText.forEach(function(element, index, array) {
                if (right_count[index] == 0)
                    element.html('<p style="color: white">No layers have been selected for this globe.</p>');
                else
                    element.html('');
            });
        }
    }

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
            latitude = 1, longitude = 1;

        if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
            var tokens = queryString.split(",");
            latitude = parseFloat(tokens[0]);
            longitude = parseFloat(tokens[1]);
            thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude), null);
            if (document.wwd_duplicate) thisLayerManager.goToAnimator_duplicated.goTo(new WorldWind.Location(latitude, longitude), null);
            addPlacemark(latitude, longitude);
        }
        else {
            this.geocoder.lookup(queryString, function (geocoder, result) {
                if (result.length > 0) {
                    latitude = parseFloat(result[0].lat);
                    longitude = parseFloat(result[0].lon);
                    thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude), null);
                    if (document.wwd_duplicate) thisLayerManager.goToAnimator_duplicated.goTo(new WorldWind.Location(latitude, longitude), null);
                }
                addPlacemark(latitude, longitude, queryString);
            });
        }

    }
};