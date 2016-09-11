function retrieval_of_data() {
    // Getting timestamps for today, yesterday, and tomorrow
    var current_time = new Date().toISOString();
    var date_stamp = current_time.split('T')[0];
    // End of timestamps code

    document.comboboxes = [];

    $('.global_combobox').combobox();
    document.global_combobox_selector = document.comboboxes[0];

    $('#global_layers_options').find("select").on("change", function (e) {
        var layerName = $('#global_layers_options').find("input")[0].defaultValue;
        if (layerName && layerName != "") {
            layerManager.onDataLayerClick(null, null, layerName);
        }
    });

// WMTS Servers
    var gibs_url = 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WorldWeather&request=GetCapabilities';
    var esa_url = 'http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?REQUEST=GetCapabilities&SERVICE=WorldWeather';
    var dlr_wmts_url = 'https://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities';

// WMS Servers
    var noaa_url = 'http://oos.soest.hawaii.edu/thredds/wms/hioos/model/atm/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd?service=WMS&version=1.3.0&request=GetCapabilities';
    var geomet_url = 'http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities';

    var ecmwf_url = 'http://apps.ecmwf.int/wms/?token=MetOceanIE';
    var us_navy_url = 'http://geoint.nrlssc.navy.mil/nrltileserver/wms?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS';
    var neo_url = 'http://neowms.sci.gsfc.nasa.gov/wms/wms';
    var eumetsat_url = 'http://185.104.180.39/eumetsat?service=wms&version=1.3.0&request=GetCapabilities';

    var usgs_urls = ['http://isse.cr.usgs.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_1Foot/ImageServer/WMSServer?request=GetCapabilities&service=WMS',
        'http://isse.cr.usgs.gov/arcgis/services/Scanned_Maps/USGS_EROS_DRG_SCALE/ImageServer/WMSServer?request=GetCapabilities&service=WMS'];

    var climate_research_url = 'http://regclim.coas.oregonstate.edu:8080/thredds/wms/regcmdata/EH5/merged/Decadal/RegCM3_Decadal_merged_EH5.ncml?service=WMS&version=1.3.0&request=GetCapabilities';

    var dlr_urls = ['https://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        'https://geoservice.dlr.de/eoc/elevation/wms?SERVICE=WMS&REQUEST=GetCapabilities', 'https://geoservice.dlr.de/eoc/basemap/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        'https://geoservice.dlr.de/eoc/imagery/wms?SERVICE=WMS&REQUEST=GetCapabilities', 'https://geoservice.dlr.de/eoc/land/wms?SERVICE=WMS&REQUEST=GetCapabilities'];

    var us_nws_urls = ['https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/NOHRSC_Snow_Analysis/MapServer/WMSServer?request=GetCapabilities&service=WMS',
        'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/WMSServer?request=GetCapabilities&service=WMS',
        'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/WMSServer?request=GetCapabilities&service=WMS',
        'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/WMSServer?request=GetCapabilities&service=WMS',
        'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/radar_base_reflectivity/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    ];

    var goes_urls = [
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_vis.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_wv.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/east_ir.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/west_ir.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/east_vis.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/west_vis.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/east_wv.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities',
        'https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/west_wv.cgi?VER=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities'];

// KML files locally saved
    var maine_url = 'university-of-maine-new.kml';

// getting data within kml file from CCI -- university of maine
    getKmlDataForCombobox(maine_url, "cci_combobox", "cci_layers_options");

// getting GIBS data from NASA WMTS server
    getWmtsDataForCombobox(gibs_url, "gibs_combobox", "layers_options", date_stamp);

// getting ESA (Sentinel) data from WMTS server
    getWmtsDataForCombobox(esa_url, "esa_combobox", "esa_layers_options", date_stamp);

// getting DLR (WMTS) geoservice WMTS server
    getWmtsDataForCombobox(dlr_wmts_url, "dlr_wmts_combobox", "dlr_wmts_layers_options", date_stamp);

// getting data from Geomet WMS Server
    getWmsTimeSeriesForCombobox(geomet_url, "geomet_combobox", "geomet_layers_options", "GDPS.", "GDPS");

// getting NOAA GFS data from University of Hawaii WMS Server
    getWmsTimeSeriesForCombobox(noaa_url, "noaa_combobox", "noaa_layers_options", "_");

// getting data from ECMWF WMS server
    getWmsTimeSeriesForCombobox(ecmwf_url, "ecmwf_combobox", "ecmwf_layers_options");

// getting NASA Earth Oberservatory data (NEO) WMS Server
    getWmsTimeSeriesForCombobox(neo_url, "neo_combobox", "neo_layers_options");

// getting US Navy WMS Server
    getWmsTimeSeriesForCombobox(us_navy_url, "navy_combobox", "navy_layers_options", "_");

// getting EUMETSAT data from WMS server
    getWmsTimeSeriesForCombobox(eumetsat_url, "eumetsat_combobox", "eumetsat_layers_options");

// getting a bunch of DLR WMS servers all at once
    getMultipleWmsTimeSeries(dlr_urls, "dlr_combobox", "dlr_layers_options", "_");

// getting a bunch of WMS servers from US NWS all at once
    getMultipleWmsTimeSeries(us_nws_urls, "us_nws_combobox", "us_nws_layers_options", "_");

// getting ==
    getMultipleWmsTimeSeries(goes_urls, "goes_combobox", "goes_layers_options", "_");

    getMultipleWmsTimeSeries(usgs_urls, "usgs_combobox", "usgs_layers_options", "_");

    getWmsTimeSeriesForCombobox(climate_research_url, "climate_research_combobox", "climate_research_layers_options", "_");

}