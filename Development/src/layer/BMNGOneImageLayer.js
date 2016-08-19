/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BMNGOneImageLayer
 * @version $Id: BMNGOneImageLayer.js 2942 2015-03-30 21:16:36Z tgaskins $
 */
define([
        '../layer/RenderableLayer',
        '../geom/Sector',
        '../shapes/SurfaceImage',
        '../util/WWUtil'
    ],
    function (RenderableLayer, Sector, SurfaceImage, WWUtil) {
        
        var BMNGOneImageLayer = function (layer_name, image_url, bounding_box, time_string) {
            RenderableLayer.call(this, layer_name);
            var surfaceImage = null;
            if (image_url && layer_name) {
                if (bounding_box) {
                    surfaceImage = new SurfaceImage(new Sector(bounding_box.south, bounding_box.north, bounding_box.west, bounding_box.east), image_url);
                }
                else {
                    surfaceImage = new SurfaceImage(Sector.FULL_SPHERE, image_url);
                }
                this.addRenderable(surfaceImage);

                this.displayName = layer_name;
                this.shortDisplayName = this.displayName;

                this.pickEnabled = false;
                this.minActiveAltitude = 3e6;

                var date = time_string.split('-');
                this.currentTimeString = new Date(Date.UTC(date[0],date[1],date[2]));
                this.uniqueID = Math.round(Math.random()*1e9).toString();
                this.legend = null;
            }
        };

        try {
            BMNGOneImageLayer.prototype = Object.create(RenderableLayer.prototype);
            return BMNGOneImageLayer;
        } catch (error)
        {
            console.log(error);
            return null;
        }

    });