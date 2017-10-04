/*
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

import { quantize } from './mmcq';


/**
 * CanvasImage Class
 * Class that wraps the html image element and canvas.
 * It also simplifies some of the canvas context manipulation
 * with a set of helper functions.
 */
export class CanvasImage {
    constructor(image) {
        this.canvas  = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.width  = this.canvas.width  = image.width;
        this.height = this.canvas.height = image.height;

        this.context.drawImage(image, 0, 0, this.width, this.height);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    update(imageData) {
        this.context.putImageData(imageData, 0, 0);
    }

    getPixelCount() {
        return this.width * this.height;
    }

    getImageData() {
        return this.context.getImageData(0, 0, this.width, this.height);
    }
}

export default class ColorThief {

    /**
     * Use the median cut algorithm provided by quantize.js to cluster similar
     * colors and return the base color from the largest cluster.
     *
     * @param {HTMLImageElement} sourceImage
     *     The HTML image element to pull the color palette from.
     *
     * @param {number=} quality
     *     Quality is an optional argument. It needs to be an integer.
     *     1 is the highest quality settings. 10 is the default. There is a
     *     trade-off between quality and speed. The bigger the number, the
     *     faster a color will be returned but the greater the likelihood that
     *     it will not be the visually most dominant color.
     *
     * @return {{r: number, g: number, b: number}}
     */
    getColor(sourceImage, quality) {
        const palette = this.getPalette(sourceImage, 5, quality);
        return palette[0];
    };

    /**
     * Use the median cut algorithm provided by quantize.js
     * to cluster similar colors.
     *
     * BUGGY: Function does not always return the requested amount of colors.
     * It can be +/- 2.
     *
     * @param {HTMLImageElement} sourceImage
     *     The HTML image element to pull the color palette from.
     *
     * @param {number=} colorCount
     *     Determines the size of the palette; the number of colors returned.
     *     If not set, it defaults to 10.
     *
     * @param {number=} quality
     *     Quality is an optional argument. It needs to be an integer.
     *     1 is the highest quality settings. 10 is the default.
     *     There is a trade-off between quality and speed. The bigger
     *     the number, the faster the palette generation but the greater
     *     the likelihood that colors will be missed.
     *
     * @return {{r: number, g: number, b: number}[]}
     */
    getPalette(sourceImage, colorCount = 10, quality = 10) {

        if (colorCount < 2 || colorCount > 256) {
            colorCount = 10;
        }
        if (quality < 1) {
            quality = 10;
        }

        // Create custom CanvasImage object
        var image      = new CanvasImage(sourceImage);
        var imageData  = image.getImageData();
        var pixels     = imageData.data;
        var pixelCount = image.getPixelCount();

        // Store the RGB values in an array format suitable for quantize function
        var pixelArray = [];
        for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // If pixel is mostly opaque and not white
            if (a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }

        // Send array to quantize function which clusters values
        // using median cut algorithm
        var cmap    = quantize(pixelArray, colorCount);
        var palette = cmap? cmap.palette() : null;

        return palette;
    }

    getColorFromUrl(imageUrl, callback, quality) {
        sourceImage = document.createElement("img");
        sourceImage.addEventListener('load' , () => {
            var palette = this.getPalette(sourceImage, 5, quality);
            var dominantColor = palette[0];
            callback(dominantColor, imageUrl);
        });
        sourceImage.src = imageUrl;
    }

    getImageData(imageUrl, callback) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'arraybuffer'
        xhr.onload = function(e) {
            if (this.status == 200) {
                uInt8Array = new Uint8Array(this.response)
                i = uInt8Array.length
                binaryString = new Array(i);
                for (var i = 0; i < uInt8Array.length; i++){
                    binaryString[i] = String.fromCharCode(uInt8Array[i])
                }
                data = binaryString.join('')
                base64 = window.btoa(data)
                callback("data:image/png;base64,"+base64)
            }
        }
        xhr.send();
    }

    getColorAsync(imageUrl, callback, quality) {
        this.getImageData(imageUrl, (imageData) => {
            sourceImage = document.createElement("img");
            sourceImage.addEventListener('load' , () => {
                var palette = this.getPalette(sourceImage, 5, quality);
                var dominantColor = palette[0];
                callback(dominantColor, this);
            });
            sourceImage.src = imageData;
        });
    }
}

