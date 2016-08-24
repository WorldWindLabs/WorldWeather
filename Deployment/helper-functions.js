/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

function onLayerTagDelete(evt, layerUniqueID) {
    document.layerManager.onLayerDelete(null, layerUniqueID);
}

function moveWmtsLayer(layerUniqueID, direction) {
    var layer = findLayerByID(layerUniqueID);
    var layer_config = layer.copyConstructorConfig;
    var movement = null;
    if (direction == "previous")
        movement = new Date(layer.currentTimeString.getTime() - (24 * 60 * 60 * 1000));
    else if (direction == "big-previous")
        movement = new Date(layer.currentTimeString.getTime() - (7 * 24 * 60 * 60 * 1000));
    else if (direction == "next")
        movement = new Date(layer.currentTimeString.getTime() + (24 * 60 * 60 * 1000));
    else if (direction == "big-next")
        movement = new Date(layer.currentTimeString.getTime() + (7 * 24 * 60 * 60 * 1000));
    else if (direction == "huge-next")
        movement = new Date(layer.currentTimeString.getTime() + (365 * 24 * 60 * 60 * 1000));
    else if (direction == "huge-previous")
        movement = new Date(layer.currentTimeString.getTime() - (365 * 24 * 60 * 60 * 1000));
    else
        return null;

    replaceLayerByID(layerUniqueID, new WorldWind.WmtsLayer(layer_config, movement.toISOString().split('T')[0]));
    document.wwd.redraw();
    $("#legend_time_" + layerUniqueID).html(movement.toUTCString());
}

function changeDataSourcesTab(evt, tabClicked) {
    $(".data_sources_tab").css('display', 'none');
    $("#" + tabClicked + "_data_sources").css('display', 'block');
    $(".data_sources_page").removeClass('is-active');
    $("#" + tabClicked + "_data_tab").addClass('is-active');
}

function parsingKMLLayer(section) {
    var kml_layer = {name: null, time_span: null, lat_lon_box: null, icon: null};
    var section_children = section[0].childNodes;

    for (var i = 0; i < section_children.length; i++) {
        switch (section_children[i].nodeName.toLowerCase()) {
            case "name":
                kml_layer.name = section_children[i].textContent;
                break;
            case "timespan":
                kml_layer.time_span = {begin: null, end: null};
                var timespan_child = section_children[i];
                for (var k = 0; k < timespan_child.childNodes.length; k++) {
                    var ts_key_name = timespan_child.childNodes[k].nodeName;
                    if (ts_key_name in kml_layer.time_span)
                        kml_layer.time_span[ts_key_name] = timespan_child.childNodes[k].textContent;
                }
                break;
            case "latlonbox":
                kml_layer.lat_lon_box = {north: null, south: null, west: null, east: null};
                for (var j = 0; j < section_children[i].childNodes.length; j++) {
                    var key_name = section_children[i].childNodes[j].nodeName;
                    if (key_name in kml_layer.lat_lon_box)
                        kml_layer.lat_lon_box[key_name] = parseInt(section_children[i].childNodes[j].textContent);
                }
                break;
            case "icon":
                kml_layer.icon = {href: null, view_bound_scale: null};
                var icon_child = section_children[i];
                for (var p = 0; p < icon_child.childNodes.length; p++) {
                    var icon_key_name = icon_child.childNodes[p].nodeName;
                    if (icon_key_name in kml_layer.icon)
                        kml_layer.icon[icon_key_name] = icon_child.childNodes[p].textContent;
                }
                break;
            default:
                break;
        }
    }
    return kml_layer;
}

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
    if (typeof str === 'string') {
        var splitStr = str.split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }
    return str;
}

// Managing the tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    //If the page has just been loaded, Get all elements with class="tabcontent" and hide them
    if (!document.isInit) {
        document.isInit = 1;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        document.viewControlsLayer.enabled = true;
    }

    // Get all elements with class="tablinks" and remove the attribute "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].hasAttribute("target", "active")) {

            tablinks[i].removeAttribute("target", "active");
        }

    }

    // Show the current tab, and add an "active" attribute to the link
    // that opened the tab, or remove it if it was already open
    if (document.getElementById(tabName).style.display == "none") {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.setAttribute("target", "active");
    }
    else {
        document.getElementById(tabName).style.display = "none";
        document.getElementById(tabName).className.replace("active", "");
        evt.currentTarget.removeAttribute("target", "active");
    }

    // remove all other tabs except for the one that was clicked, but do not let this apply to the help tab

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {

        if (tabcontent[i].id != tabName.toString() && tabcontent[i].id != "help_div" && tabName.toString() != "help_div" && tabcontent[i].id != "info_div" && tabName.toString() != "info_div")
            tabcontent[i].style.display = "none";
    }

    if (tabName.toString() == "help_div") {
        $('#info_div').css('display', 'none')
    }

    if (tabName.toString() == "info_div") {
        $('#help_div').css('display', 'none')
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

function layerCategoriesOnClick(layerPressed) {
    // TODO: do something here please
}

function updateLayerCategories(newContent) {
    for (var key in newContent) {
        if (newContent.hasOwnProperty(key)) {
            var selector = $('.' + key + 'Combobox');
            if (selector.length > 0) {
                var additionalHTML = "";
                for (var i = 0; i < newContent[key].length; i++) additionalHTML += '<option><a>' + newContent[key][i] + '</a></option>';
                selector.html(selector.html() + additionalHTML);
            }
        }
    }

    if (!document.layerCategoriesInitialized) {
        $('.categories_combobox').combobox();
        $('#categories_div').find(" select").on("change", function (e) {
            layerCategoriesOnClick(e);
        });
        document.layerCategoriesInitialized = true;
    }
}

function findLayerByID(layerID) {
    for (var i = 0; i < document.wwd.layers.length; i++)
        if (document.wwd.layers[i].uniqueID && document.wwd.layers[i].uniqueID == layerID) return document.wwd.layers[i];
    return null;
}

function replaceLayerByID(layerID, replacementLayer) {
    for (var i = 0; i < document.wwd.layers.length; i++)
        if (document.wwd.layers[i].uniqueID && document.wwd.layers[i].uniqueID == layerID) document.wwd.layers[i] = replacementLayer;
}

function addPlacemark(lat, long, dest) {
    //define the image
    var pin_image = "plain-red.png";

    if (!document.placemarkLayer) {
        document.placemarkLayer = new WorldWind.RenderableLayer("Placemarks");
        document.wwd.addLayer(document.placemarkLayer);
    }
    var pinLibrary = "images/pushpins/", // location of the image files
        placemark,
        placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
        highlightAttributes,
        destination = dest,
        latitude = lat,
        longitude = long;

    // Set up the common placemark attributes.
    placemarkAttributes.imageScale = 10;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.0);
    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);
    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.labelAttributes.scale = 10;
    placemarkAttributes.drawLeaderLine = true;
    placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

    // For each placemark image, create a placemark with a label.

    // Create the placemark and its label.
    placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e3), true, null);
    placemark.label = titleCase(destination) + "\n";
    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    placemark.eyeDistanceScalingLabelThreshold = 4e7;
    placemark.eyeDistanceScalingThreshold = 2e6;

    // Create the placemark attributes for this placemark. Note that the attributes differ only by their
    // image URL.
    placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    placemarkAttributes.imageSource = pinLibrary + pin_image;
    placemark.attributes = placemarkAttributes;

    // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
    // the default highlight attributes so that all properties are identical except the image scale. You could
    // instead vary the color, image, or other property to control the highlight representation.
    highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    highlightAttributes.imageScale = 1.2;
    placemark.highlightAttributes = highlightAttributes;

    // Add the placemark to the layer.
    document.placemarkLayer.addRenderable(placemark);

    // Add the placemarks layer to the World Window's layer list.
    document.layerManager.synchronizeLayerList();
}

function showHideLegends(evt, t, selectedItem, layerID) {
    if (selectedItem == "info") {
        var legends_modal_selector = $("#legends_modal");
        var legends_modal_title = $("#legends_modal_title");
        var legends_modal_text = $("#legends_modal_text");
        var selectedLayer = findLayerByID(layerID);

        legends_modal_title.html(selectedLayer.displayName);
        legends_modal_text.html('<img src="' + selectedLayer.legend + '" style="width: auto; height: auto; max-width: 100%; max-height: 400px"/> <br/>');
        legends_modal_selector.css('display', 'block');
    }
    else if (selectedItem == "view") {
        var footer_content = document.getElementsByClassName("card-footer-item");
        for (var a = 0; a < footer_content.length; a++)
            if (footer_content[a].id != t.id) footer_content[a].childNodes[0].innerHTML = "View";

        if (t.childNodes[0].innerHTML == "View") {
            if (document.global_view_layers && document.global_view_layers != []) {
                for (var b = 0, b_length = document.wwd.layers.length; b < b_length; b++) {
                    var internal_layer = document.wwd.layers[b];
                    for (var c = 0, c_length = document.global_view_layers.length; c < c_length; c++) {
                        if (internal_layer.uniqueID && internal_layer.uniqueID == document.global_view_layers[c]) {
                            internal_layer.enabled = true;
                            internal_layer.layerSelected = true;
                            document.layerManager.synchronizeLayerList();
                        }
                    }
                }
            }
            else document.global_view_layers = [];

            t.childNodes[0].innerHTML = "Unview";
            for (var d = 0, d_length = document.wwd.layers.length; d < d_length; d++) {

                var internal_new_layer = document.wwd.layers[d];
                if (internal_new_layer.uniqueID && internal_new_layer.uniqueID != layerID && (internal_new_layer.layerSelected || internal_new_layer.enabled)) {
                    document.global_view_layers.push(internal_new_layer.uniqueID);
                    internal_new_layer.layerSelected = true;
                    internal_new_layer.enabled = false;
                    document.layerManager.synchronizeLayerList();
                }
            }
        } else {
            t.childNodes[0].innerHTML = "View";
            for (var i = 0, len = document.wwd.layers.length; i < len; i++) {
                var layer = document.wwd.layers[i];
                for (var j = 0, length = document.global_view_layers.length; j < length; j++) {
                    if (layer.uniqueID && layer.uniqueID == document.global_view_layers[j]) {
                        layer.enabled = true;
                        layer.layerSelected = true;
                        document.layerManager.synchronizeLayerList();
                    }
                }
            }
        }
    }
    else if (selectedItem == "delete") document.layerManager.onLayerDelete(null, layerID);
    else if (selectedItem == "toggle_hide") {
        var card_content = $("#card_content_" + layerID);

        if (card_content.css('display') != "none") {
            card_content.css('display', 'none');
        }
        else {
            card_content.css('display', 'block');
        }
    }
    else if (selectedItem == "no_legends_toggle_hide") {
        var no_legend_content = $("#no_legends_content");

        if (no_legend_content.css('display') != "none") {
            no_legend_content.css('display', 'none');
        }
        else {
            no_legend_content.css('display', 'block');
        }
    }
}

function getWmtsDataForCombobox(data_url, jquery_combobox, jquery_layer_options, date_stamp, replace_in_title, stop_from_title) {
    try {
        var data_wmts_capabilities = null;

        $.get(data_url, function (wmts_response) {
            data_wmts_capabilities = new WorldWind.WmtsCapabilities(wmts_response);
        }).done(function () {
            var wmts_data = [];

            function data_recursive(section) {
                if (section) {
                    if (section.layer && section.layer.length > 0) {
                        for (var i = 0; i < section.layer.length; i++) data_recursive(section.layer[i]);
                    }
                    else {
                        if (stop_from_title) if (section.title.indexOf(stop_from_title) === -1) return null;

                        if (replace_in_title) section.title = $.trim(section.title.replaceAll(replace_in_title, " "));

                        section.title = titleCase(section.title);

                        if (section.title && section.title != "") {
                            var wmts_layer
                                = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
                            wmts_layer.enabled = false;
                            wmts_layer.sourceLayersOptions = jquery_layer_options;
                            document.wwd.addLayer(wmts_layer);
                            wmts_data.push(wmts_layer.displayName);
                        }
                    }
                }
            }

            data_recursive(data_wmts_capabilities.contents);

            var html_layers = "<label><select class=\"" + jquery_combobox + " explorer_combobox\"><option></option>";
            for (var r = 0; r < wmts_data.length; r++) html_layers += "<option><a>" + wmts_data[r] + "</a></option>";
            html_layers += "</select></label>";

            var data_layers_options = $("#" + jquery_layer_options);
            data_layers_options.html(html_layers);
            $('.' + jquery_combobox).combobox();

            data_layers_options.find("select").on("change", function (e) {
                document.layerManager.onDataLayerClick(e, jquery_layer_options);
            });
        });
    }
    catch (error) {
        console.log(error);
        $("#" + jquery_layer_options).html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
}

function getKmlDataForCombobox(data_url, jquery_combobox, jquery_layer_options) {
    try {
        $.get(data_url, {}, function (xml) {
            var cci_kml_layers = [];
            $('GroundOverlay', xml).each(function (i) {
                cci_kml_layers.push(parsingKMLLayer($(this)));
            });

            for (var i = 0; i < cci_kml_layers.length; i++) {
                if (cci_kml_layers[i].name && cci_kml_layers[i].icon) {
                    var kmlLayer = new WorldWind.BMNGOneImageLayer(cci_kml_layers[i].name,
                        cci_kml_layers[i].icon.href, cci_kml_layers[i].lat_lon_box, cci_kml_layers[i].time_span.begin);
                    kmlLayer.enabled = false;
                    kmlLayer.sourceLayersOptions = jquery_layer_options;
                    document.wwd.addLayer(kmlLayer);
                }
            }

            var html_layers = "<label><select class=\"" + jquery_combobox + " explorer_combobox\"><option></option>";
            for (var n = 0; n < cci_kml_layers.length; n++) html_layers += "<option><a >" + cci_kml_layers[n].name + "</a></option>";
            html_layers += "</select></label>";

            var cci_layers_options = $("#" + jquery_layer_options);
            cci_layers_options.html(html_layers);
            $('.' + jquery_combobox).combobox();
            cci_layers_options.find("select").on("change", function (e) {
                document.layerManager.onDataLayerClick(e, "cci_layers_options");
            });

        });
    }
    catch (error) {
        console.log(error);
    }
}

function getWmsTimeSeriesForCombobox(data_url, jquery_combobox, jquery_layer_options, replace_in_title, stop_from_title) {
    try {
        var data_wms_capabilities = null;
        $.get(data_url, function (data_response) {
            data_wms_capabilities = new WorldWind.WmsCapabilities(data_response);
        }).done(function () {
            var wms_data = [];

            function data_recursive(section) {
                if (section) {
                    if (section.layers && section.layers.length > 0) {
                        for (var i = 0; i < section.layers.length; i++) data_recursive(section.layers[i]);
                    } else {
                        if (section.title && section.title != "") {
                            if (stop_from_title) {
                                if (section.title.indexOf(stop_from_title) === -1) {
                                    return null;
                                }
                            }

                            if (replace_in_title) {
                                section.title = section.title.replaceAll(replace_in_title, " ");
                                section.title = $.trim(section.title);
                            }

                            section.title = titleCase(section.title);

                            var config = WorldWind.WmsLayer.formLayerConfiguration(section);
                            var layer = null, timeSequence = null;

                            if (config.timeSequences) {
                                if (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence) {
                                    timeSequence = config.timeSequences[config.timeSequences.length - 1];
                                    config.levelZeroDelta = new WorldWind.Location(180, 180);

                                    layer = new WorldWind.WmsTimeDimensionedLayer(config);
                                    layer.time = timeSequence.endTime;
                                    layer.timeSequence = timeSequence;
                                }
                                else if (config.timeSequences[config.timeSequences.length - 1] instanceof Date) {
                                    if (config.timeSequences.length > 2) {
                                        var end_datetime = config.timeSequences[config.timeSequences.length - 1];
                                        var start_datetime = config.timeSequences[1];
                                        var period = parseInt(Math.round((config.timeSequences[2].getTime() - config.timeSequences[1].getTime()) / (1000 * 60)));
                                        var period_string = "PT" + period + "M";
                                        var sequence_string = start_datetime.toISOString() + "/" + end_datetime.toISOString() + "/" + period_string;

                                        timeSequence = new WorldWind.PeriodicTimeSequence(sequence_string);

                                        config.levelZeroDelta = new WorldWind.Location(180, 180);
                                        layer = new WorldWind.WmsTimeDimensionedLayer(config);
                                        layer.timeSequence = timeSequence;
                                        layer.time = timeSequence.endTime;
                                    }
                                    else {
                                        layer = new WorldWind.WmsLayer(config);
                                        layer.currentTimeString = config.timeSequences[config.timeSequences.length - 1].toISOString();
                                    }
                                }
                                else {
                                    layer = new WorldWind.WmsLayer(config);
                                }
                            }
                            else {
                                layer = new WorldWind.WmsLayer(config);
                            }

                            layer.enabled = false;
                            layer.sourceLayersOptions = jquery_layer_options;
                            document.wwd.addLayer(layer);
                            wms_data.push(layer.displayName);
                        }
                    }
                }
            }

            data_recursive(data_wms_capabilities.capability);

            var html_layers = "<label><select class=\"" + jquery_combobox + " explorer_combobox\"><option></option>";
            for (var r = 0; r < wms_data.length; r++) html_layers += "<option><a>" + wms_data[r] + "</a></option>";
            html_layers += "</select></label>";

            var data_layers_options = $("#" + jquery_layer_options);
            data_layers_options.html(html_layers);
            $('.' + jquery_combobox).combobox();

            data_layers_options.find("select").on("change", function (e) {
                document.layerManager.onDataLayerClick(e, jquery_layer_options);
            });
        });
    }
    catch (error) {
        console.log(error);
        $("#" + jquery_layer_options).html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
}

function addDataToCombobox(wms_data, jquery_combobox, jquery_layer_options) {
    var html_layers = "<label><select class=\"" + jquery_combobox + " explorer_combobox\"><option></option>";
    for (var r = 0; r < wms_data.length; r++) html_layers += "<option><a>" + wms_data[r] + "</a></option>";
    html_layers += "</select></label>";

    var data_layers_options = $("#" + jquery_layer_options);
    data_layers_options.html(html_layers);
    $('.' + jquery_combobox).combobox();

    data_layers_options.find("select").on("change", function (e) {
        document.layerManager.onDataLayerClick(e, jquery_layer_options);
    });
}

function getMultipleWmsTimeSeries(multiple_data_urls, jquery_combobox, jquery_layer_options, replace_in_title, stop_from_title) {
    try {
        var data_wms_capabilities;
        var wms_data = [];

        var completed_url_gets = Object.defineProperties({}, {
            "bar": {
                get: function () {
                    return this.value;
                },
                set: function (val) {
                    if (val == (multiple_data_urls.length - 1)) addDataToCombobox(wms_data, jquery_combobox, jquery_layer_options);
                    this.value = val;
                }
            }
        });

        completed_url_gets.bar = 0;

        for (var url = 0; url < multiple_data_urls.length; url++) {
            data_wms_capabilities = null;
            $.get(multiple_data_urls[url], function (data_response) {
                data_wms_capabilities = new WorldWind.WmsCapabilities(data_response);
            }).done(function () {
                function data_recursive(section) {
                    if (section) {
                        if (section.layers && section.layers.length > 0) {
                            for (var i = 0; i < section.layers.length; i++) data_recursive(section.layers[i]);
                        } else {
                            if (section.title && section.title != "") {
                                if (stop_from_title) {
                                    if (section.title.indexOf(stop_from_title) === -1) return null;
                                }

                                if (replace_in_title) {
                                    section.title = section.title.replaceAll(replace_in_title, " ");
                                    section.title = $.trim(section.title);
                                }

                                section.title = titleCase(section.title);

                                var config = WorldWind.WmsLayer.formLayerConfiguration(section);
                                var layer = null, timeSequence = null;

                                if (config.timeSequences) {
                                    if (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence) {
                                        timeSequence = config.timeSequences[config.timeSequences.length - 1];
                                        config.levelZeroDelta = new WorldWind.Location(180, 180);

                                        layer = new WorldWind.WmsTimeDimensionedLayer(config);
                                        layer.time = timeSequence.endTime;
                                        layer.timeSequence = timeSequence;
                                    }
                                    else if (config.timeSequences[config.timeSequences.length - 1] instanceof Date) {
                                        if (config.timeSequences.length > 2) {
                                            var end_datetime = config.timeSequences[config.timeSequences.length - 1];
                                            var start_datetime = config.timeSequences[1];
                                            var period = parseInt(Math.round((config.timeSequences[2].getTime() - config.timeSequences[1].getTime()) / (1000 * 60)));
                                            var period_string = "PT" + period + "M";
                                            var sequence_string = start_datetime.toISOString() + "/" + end_datetime.toISOString() + "/" + period_string;

                                            timeSequence = new WorldWind.PeriodicTimeSequence(sequence_string);

                                            config.levelZeroDelta = new WorldWind.Location(180, 180);
                                            layer = new WorldWind.WmsTimeDimensionedLayer(config);
                                            layer.timeSequence = timeSequence;
                                            layer.time = timeSequence.endTime;
                                        }
                                        else {
                                            layer = new WorldWind.WmsLayer(config);
                                            layer.currentTimeString = new Date(config.timeSequences[config.timeSequences.length - 1]);
                                        }
                                    }
                                    else {
                                        layer = new WorldWind.WmsLayer(config);
                                    }
                                }
                                else {
                                    layer = new WorldWind.WmsLayer(config);
                                }

                                layer.enabled = false;
                                layer.sourceLayersOptions = jquery_layer_options;
                                document.wwd.addLayer(layer);
                                wms_data.push(layer.displayName);
                            }
                        }
                    }
                }

                data_recursive(data_wms_capabilities.capability);
                completed_url_gets.bar = completed_url_gets.bar + 1;
            });
        }
    }
    catch (error) {
        console.log(error);
        $("#" + jquery_layer_options).html("<img src=\"notification-error.png\" style=\"width: 25%\"/>");
    }
}

function alterWmsLayerTime(evt, layerID, direction) {
    var layer = findLayerByID(layerID);

    if (direction == "next")
        layer.time = layer.timeSequence.next();
    else if (direction == "previous")
        layer.time = layer.timeSequence.previous();
    else if (direction == "start") {
        layer.time = layer.timeSequence.startTime;
        layer.timeSequence.currentTime = layer.time;
    }
    else if (direction == "end") {
        layer.time = layer.timeSequence.endTime;
        layer.timeSequence.currentTime = layer.time;
    }
    else {
        layer.time = direction;
        layer.timeSequence.currentTime = layer.time;
    }

    document.wwd.redraw();
}