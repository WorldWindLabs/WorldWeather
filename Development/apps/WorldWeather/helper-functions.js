/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

function parsingKMLLayer(section) {
    var kml_layer = {name: null, time_span: null, lat_lon_box: null, icon: null};
    for (var i = 0; i < section[0].children.length; i++) {
        switch (section[0].children[i].nodeName.toLowerCase()) {
            case "name":
                kml_layer.name = section[0].children[i].textContent;
                break;
            case "timespan":
                kml_layer.time_span = {
                    begin: section[0].children[i].children[0].textContent,
                    end: section[0].children[i].children[1].textContent
                };
                break;
            case "latlonbox":
                kml_layer.lat_lon_box = {north: null, south: null, west: null, east: null};
                for (var j = 0; j < section[0].children[i].children.length; j++) {
                    kml_layer.lat_lon_box[section[0].children[i].children[j].nodeName] = parseFloat(section[0].children[i].children[j].textContent);
                }
                break;
            case "icon":
                kml_layer.icon = {
                    href: section[0].children[i].children[0].textContent,
                    view_bound_scale: parseFloat(section[0].children[i].children[1].textContent)
                };
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
    if (!document.isInit) {

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

function layerCategoriesOnClick(layerPressed) {
    // TODO: do something here please
}

function updateLayerCategories(newContent) {
    for (var key in newContent) {
        if (newContent.hasOwnProperty(key)) {
            var selector = $('.' + key + 'Combobox');
            if (selector.length > 0) {
                var additionalHTML = "";
                for (var i = 0; i < newContent[key].length; i++) {
                    additionalHTML += '<option><a>' + newContent[key][i] + '</a></option>';
                }
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
    for (var i = 0; i < document.wwd.layers.length; i++) {
        if (document.wwd.layers[i].uniqueID && document.wwd.layers[i].uniqueID == layerID) {
            return document.wwd.layers[i];
        }
    }
    return null;
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

        footercontent = document.getElementsByClassName("card-footer-item");
        for (i = 0; i < footercontent.length; i++) {

            if (footercontent[i].id != t.id)
                footercontent[i].childNodes[0].innerHTML = "View";
        }


        if (t.childNodes[0].innerHTML == "View") {

            if (document.x)
            {
                for (var i = 0, len = document.wwd.layers.length; i < len; i++) {

                    var layer = document.wwd.layers[i];
                    for (var j = 0, length = document.x.length; j < length; j++) {


                        if (layer.uniqueID && layer.uniqueID == document.x[j]) {
                            layer.enabled = true;
                            document.layerManager.synchronizeLayerList();

                        }
                    }


                }
            }
            else
                document.x=[];


            t.childNodes[0].innerHTML = "Unview";

            for (var i = 0, len = document.wwd.layers.length; i < len; i++) {

                var layer = document.wwd.layers[i];
                if (layer.uniqueID && layer.uniqueID != layerID && layer.enabled) {
                    //layer.hide = true;
                    document.x.push(layer.uniqueID);
                    layer.enabled = false;
                    document.layerManager.synchronizeLayerList();

                }

            }

        } else {
            t.childNodes[0].innerHTML = "View";
            // myLayers=$('.list-group-item').find("button");
            // console.log(myLayers.length);
            //var layer = this.wwd.layers[identifier];

            //var uniqueSelector = $("#" + layer.uniqueID);

            // for(var i = 0, len = myLayers.length; i < len; i++){
            //     console.log(myLayers[i].identifier);
            // }

            for (var i = 0, len = document.wwd.layers.length; i < len; i++) {

                var layer = document.wwd.layers[i];
                for (var j = 0, length = document.x.length; j < length; j++) {


                    if (layer.uniqueID && layer.uniqueID == document.x[j]) {
                        layer.enabled = true;
                        document.layerManager.synchronizeLayerList();

                    }
                }


            }

        }
    }
    else if (selectedItem == "delete") {

        // TODO: add functionality to delete here

    }
    else if (selectedItem == "toggle_hide") {
        var card_content = $("#card_content_" + layerID);

        if (card_content.css('display') != "none") {
            card_content.css('display', 'none');
        }
        else {
            card_content.css('display', 'unset');
        }
    }
    else if (selectedItem == "no_legends_toggle_hide") {
        var no_legend_content = $("#no_legends_content");

        if (no_legend_content.css('display') != "none") {
            no_legend_content.css('display', 'none');
        }
        else {
            no_legend_content.css('display', 'unset');
        }
    }
}

function getWmsDataForCombobox(data_url, jquery_combobox, jquery_layer_options, replace_in_title, stop_from_title) {
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

                            var data_layer = new WorldWind.WmsLayer(WorldWind.WmsLayer.formLayerConfiguration(section));
                            data_layer.enabled = false;
                            document.wwd.addLayer(data_layer);
                            wms_data.push(data_layer.displayName);
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


function getWmtsDataForCombobox(data_url, jquery_combobox, jquery_layer_options, date_stamp, replace_in_title, stop_from_title) {
    try {
        var data_wmts_capabilities = null;

        $.get(data_url, function (wmts_response) {
            data_wmts_capabilities = new WorldWind.WmtsCapabilities(wmts_response);
        }).done(function () {
            var wmts_data = [];

            function data_recursive(section) {
                if (section.layer && section.layer.length > 0) {
                    for (var i = 0; i < section.layer.length; i++) data_recursive(section.layer[i]);
                }
                else {
                    if (section.title && section.title != "") {
                        var wmts_layer = new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(section), date_stamp);
                        wmts_layer.enabled = false;
                        document.wwd.addLayer(wmts_layer);
                        wmts_data.push(wmts_layer.displayName);
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


function getKmlDataForCombobox(data_url, jquery_combobox, jquery_layer_options)
{
    try {
        $.get(data_url, {}, function (xml) {
            var cci_kml_layers = [];
            $('GroundOverlay', xml).each(function (i) {
                cci_kml_layers.push(parsingKMLLayer($(this)));
            });

            for (var i = 0; i < cci_kml_layers.length; i++) {
                var kmlLayer = new WorldWind.BMNGOneImageLayer(cci_kml_layers[i].name,
                    cci_kml_layers[i].icon.href, cci_kml_layers[i].lat_lon_box, cci_kml_layers[i].time_span.begin);
                kmlLayer.enabled = false;
                document.wwd.addLayer(kmlLayer);
            }
            
            var html_layers = "<label><select class=\""+jquery_combobox+" explorer_combobox\"><option></option>";
            for (var n = 0; n < cci_kml_layers.length; n++) html_layers += "<option><a >" + cci_kml_layers[n].name + "</a></option>";
            html_layers += "</select></label>";

            var cci_layers_options = $("#"+jquery_layer_options);
            cci_layers_options.html(html_layers);
            $('.'+jquery_combobox).combobox();
            cci_layers_options.find("select").on("change", function (e) {
                document.layerManager.onDataLayerClick(e, "cci_layers_options");
            });

        });
    }
    catch (error) {
        console.log(error);
    }
}