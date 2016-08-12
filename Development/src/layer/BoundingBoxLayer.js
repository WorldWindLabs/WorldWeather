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
        "use strict";

        var BoundingBoxLayer = function (name_of_layer, image_url, bounding_box) {
            RenderableLayer.call(this, name_of_layer);

            var surfaceImage = new SurfaceImage(Sector.FULL_SPHERE, image_url);

            this.addRenderable(surfaceImage);

            this.pickEnabled = false;
            this.minActiveAltitude = 3e6;
        };

        BoundingBoxLayer.prototype = Object.create(RenderableLayer.prototype);

        return BoundingBoxLayer;
    });