/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

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

function showHideLegends(evt, selectedItem, layerID) {

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

    }
    else if (selectedItem == "delete") {

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
