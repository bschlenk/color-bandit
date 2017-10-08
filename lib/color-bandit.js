(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("canvas"), require("fs"));
	else if(typeof define === 'function' && define.amd)
		define("ColorBandit", ["canvas", "fs"], factory);
	else if(typeof exports === 'object')
		exports["ColorBandit"] = factory(require("canvas"), require("fs"));
	else
		root["ColorBandit"] = factory(root["canvas"], root["fs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCanvas = createCanvas;
exports.loadImage = loadImage;

var _canvas = __webpack_require__(2);

var _canvas2 = _interopRequireDefault(_canvas);

var _fs = __webpack_require__(3);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Image = _canvas2.default.Image;
function createCanvas(width, height) {
  return new _canvas2.default(width, height);
}

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(src, function (err, data) {
      if (err) {
        return reject(err);
      }
      var image = new Image();
      image.src = data;
      return resolve(image);
    });
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPalette = getPalette;
exports.getColor = getColor;
exports.getColorFromUrl = getColorFromUrl;
exports.getImageData = getImageData;
exports.getColorAsync = getColorAsync;

var _canvas = __webpack_require__(0);

var _canvasImage = __webpack_require__(4);

var _canvasImage2 = _interopRequireDefault(_canvasImage);

var _mmcq = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function getPalette(sourceImage) {
  var colorCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

  if (colorCount < 2 || colorCount > 256) {
    colorCount = 10;
  }
  if (quality < 1) {
    quality = 10;
  }

  // Create custom CanvasImage object
  var image = new _canvasImage2.default(sourceImage);
  var imageData = image.getImageData();
  var pixels = imageData.data;
  var pixelCount = image.getPixelCount();

  // Store the RGB values in an array format suitable for quantize function
  var pixelArray = [];
  for (var i = 0, offset, r, g, b, a; i < pixelCount; i += quality) {
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
  var cmap = (0, _mmcq.quantize)(pixelArray, colorCount);
  var palette = cmap ? cmap.palette() : null;

  return palette;
}

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

function getColor(sourceImage, quality) {
  var palette = getPalette(sourceImage, 5, quality);
  return palette[0];
}

function getColorFromUrl(imageUrl, callback, quality) {
  return (0, _canvas.loadImage)(imageUrl).then(function (image) {
    var palette = getPalette(image, 5, quality);
    var dominantColor = palette[0];
    return dominantColor;
  });
}

function getImageData(imageUrl) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      if (_this.status == 200) {
        var uInt8Array = new Uint8Array(_this.response);
        var binaryString = new Array(uInt8Array.length);
        for (var i = 0; i < uInt8Array.length; ++i) {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');
        var base64 = window.btoa(data);
        resolve('data:image/png;base64,' + base64);
      }
    };
    xhr.onerror = reject;
    xhr.send();
  });
}

function getColorAsync(imageUrl, callback, quality) {
  return getImageData(imageUrl, _canvas.loadImage).then(function (image) {
    var palette = getPalette(image, 5, quality);
    return [palette[0], image];
  });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CanvasImage Class
 * Class that wraps the html image element and canvas.
 * It also simplifies some of the canvas context manipulation
 * with a set of helper functions.
 */
var CanvasImage = function () {
  function CanvasImage(image) {
    _classCallCheck(this, CanvasImage);

    var width = image.width,
        height = image.height;


    this.canvas = (0, _canvas.createCanvas)(width, height);
    this.context = this.canvas.getContext('2d');

    this.width = width;
    this.height = height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  _createClass(CanvasImage, [{
    key: 'clear',
    value: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }, {
    key: 'update',
    value: function update(imageData) {
      this.context.putImageData(imageData, 0, 0);
    }
  }, {
    key: 'getPixelCount',
    value: function getPixelCount() {
      return this.width * this.height;
    }
  }, {
    key: 'getImageData',
    value: function getImageData() {
      return this.context.getImageData(0, 0, this.width, this.height);
    }
  }]);

  return CanvasImage;
}();

exports.default = CanvasImage;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.quantize = quantize;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @license
 */

// fill out a couple protovis dependencies
/*!
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 * @license
 */
var pv = {
  map: function map(array, f) {
    var o = {};
    return f ? array.map(function (d, i) {
      o.index = i;return f.call(o, d);
    }) : array.slice();
  },
  naturalOrder: function naturalOrder(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  },
  sum: function sum(array, f) {
    var o = {};
    return array.reduce(f ? function (p, d, i) {
      o.index = i;return p + f.call(o, d);
    } : function (p, d) {
      return p + d;
    }, 0);
  },
  max: function max(array, f) {
    return Math.max.apply(null, f ? pv.map(array, f) : array);
  }
};

/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 *
 * @author Nick Rabinowitz
 * @example

// array of pixels as [R,G,B] arrays
var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                // etc
                ];
var maxColors = 4;

var cmap = MMCQ.quantize(myPixels, maxColors);
var newPalette = cmap.palette();
var newPixels = myPixels.map(function(p) {
    return cmap.map(p);
});

 */
// private constants
var sigbits = 5;
var rshift = 8 - sigbits;
var maxIterations = 1000;
var fractByPopulations = 0.75;

// get reduced-space color index for a pixel
function getColorIndex(r, g, b) {
  return (r << 2 * sigbits) + (g << sigbits) + b;
}

// Simple priority queue

var PQueue = function () {
  function PQueue(comparator) {
    _classCallCheck(this, PQueue);

    this.comparator = comparator;
    this.contents = [];
    this.sorted = false;
  }

  _createClass(PQueue, [{
    key: 'sort',
    value: function sort() {
      this.contents.sort(this.comparator);
      this.sorted = true;
    }
  }, {
    key: 'push',
    value: function push(o) {
      this.contents.push(o);
      this.sorted = false;
    }
  }, {
    key: 'peek',
    value: function peek(index) {
      if (!this.sorted) this.sort();
      if (index === undefined) index = this.contents.length - 1;
      return this.contents[index];
    }
  }, {
    key: 'pop',
    value: function pop() {
      if (!this.sorted) this.sort();
      return this.contents.pop();
    }
  }, {
    key: 'size',
    value: function size() {
      return this.contents.length;
    }
  }, {
    key: 'map',
    value: function map(f) {
      return this.contents.map(f);
    }
  }, {
    key: 'debug',
    value: function debug() {
      if (!this.sorted) this.sort();
      return this.contents;
    }
  }]);

  return PQueue;
}();

// 3d color space box


var VBox = function () {
  function VBox(r1, r2, g1, g2, b1, b2, histo) {
    _classCallCheck(this, VBox);

    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.histo = histo;
  }

  _createClass(VBox, [{
    key: 'volume',
    value: function volume(force) {
      var vbox = this;
      if (!vbox._volume || force) {
        vbox._volume = (vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1);
      }
      return vbox._volume;
    }
  }, {
    key: 'count',
    value: function count(force) {
      var vbox = this,
          histo = vbox.histo;
      if (!vbox._count_set || force) {
        var npix = 0,
            index,
            i,
            j,
            k;
        for (i = vbox.r1; i <= vbox.r2; i++) {
          for (j = vbox.g1; j <= vbox.g2; j++) {
            for (k = vbox.b1; k <= vbox.b2; k++) {
              index = getColorIndex(i, j, k);
              npix += histo[index] || 0;
            }
          }
        }
        vbox._count = npix;
        vbox._count_set = true;
      }
      return vbox._count;
    }
  }, {
    key: 'copy',
    value: function copy() {
      var vbox = this;
      return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
    }
  }, {
    key: 'avg',
    value: function avg(force) {
      var vbox = this,
          histo = vbox.histo;
      if (!vbox._avg || force) {
        var ntot = 0,
            mult = 1 << 8 - sigbits,
            rsum = 0,
            gsum = 0,
            bsum = 0,
            hval,
            i,
            j,
            k,
            histoindex;
        for (i = vbox.r1; i <= vbox.r2; i++) {
          for (j = vbox.g1; j <= vbox.g2; j++) {
            for (k = vbox.b1; k <= vbox.b2; k++) {
              histoindex = getColorIndex(i, j, k);
              hval = histo[histoindex] || 0;
              ntot += hval;
              rsum += hval * (i + 0.5) * mult;
              gsum += hval * (j + 0.5) * mult;
              bsum += hval * (k + 0.5) * mult;
            }
          }
        }
        if (ntot) {
          vbox._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
        } else {
          vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)];
        }
      }
      return vbox._avg;
    }
  }, {
    key: 'contains',
    value: function contains(pixel) {
      var vbox = this,
          rval = pixel[0] >> rshift;
      gval = pixel[1] >> rshift;
      bval = pixel[2] >> rshift;
      return rval >= vbox.r1 && rval <= vbox.r2 && gval >= vbox.g1 && gval <= vbox.g2 && bval >= vbox.b1 && bval <= vbox.b2;
    }
  }]);

  return VBox;
}();

// Color map


var CMap = function () {
  function CMap() {
    _classCallCheck(this, CMap);

    this.vboxes = new PQueue(function (a, b) {
      return pv.naturalOrder(a.vbox.count() * a.vbox.volume(), b.vbox.count() * b.vbox.volume());
    });
  }

  _createClass(CMap, [{
    key: 'push',
    value: function push(vbox) {
      this.vboxes.push({
        vbox: vbox,
        color: vbox.avg()
      });
    }
  }, {
    key: 'palette',
    value: function palette() {
      return this.vboxes.map(function (vb) {
        return vb.color;
      });
    }
  }, {
    key: 'size',
    value: function size() {
      return this.vboxes.size();
    }
  }, {
    key: 'map',
    value: function map(color) {
      var vboxes = this.vboxes;
      for (var i = 0; i < vboxes.size(); i++) {
        if (vboxes.peek(i).vbox.contains(color)) {
          return vboxes.peek(i).color;
        }
      }
      return this.nearest(color);
    }
  }, {
    key: 'nearest',
    value: function nearest(color) {
      var vboxes = this.vboxes,
          d1,
          d2,
          pColor;
      for (var i = 0; i < vboxes.size(); i++) {
        d2 = Math.sqrt(Math.pow(color[0] - vboxes.peek(i).color[0], 2) + Math.pow(color[1] - vboxes.peek(i).color[1], 2) + Math.pow(color[2] - vboxes.peek(i).color[2], 2));
        if (d2 < d1 || d1 === undefined) {
          d1 = d2;
          pColor = vboxes.peek(i).color;
        }
      }
      return pColor;
    }
  }, {
    key: 'forcebw',
    value: function forcebw() {
      // XXX: won't  work yet
      var vboxes = this.vboxes;
      vboxes.sort(function (a, b) {
        return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));
      });

      // force darkest color to black if everything < 5
      var lowest = vboxes[0].color;
      if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5) vboxes[0].color = [0, 0, 0];

      // force lightest color to white if everything > 251
      var idx = vboxes.length - 1,
          highest = vboxes[idx].color;
      if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251) vboxes[idx].color = [255, 255, 255];
    }
  }]);

  return CMap;
}();

// histo (1-d array, giving the number of pixels in
// each quantized region of color space), or null on error


function getHisto(pixels) {
  var histosize = 1 << 3 * sigbits,
      histo = new Array(histosize),
      index,
      rval,
      gval,
      bval;
  pixels.forEach(function (pixel) {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    index = getColorIndex(rval, gval, bval);
    histo[index] = (histo[index] || 0) + 1;
  });
  return histo;
}

function vboxFromPixels(pixels, histo) {
  var rmin = 1000000,
      rmax = 0,
      gmin = 1000000,
      gmax = 0,
      bmin = 1000000,
      bmax = 0,
      rval,
      gval,
      bval;
  // find min/max
  pixels.forEach(function (pixel) {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    if (rval < rmin) rmin = rval;else if (rval > rmax) rmax = rval;
    if (gval < gmin) gmin = gval;else if (gval > gmax) gmax = gval;
    if (bval < bmin) bmin = bval;else if (bval > bmax) bmax = bval;
  });
  return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
}

function medianCutApply(histo, vbox) {
  if (!vbox.count()) return;

  var rw = vbox.r2 - vbox.r1 + 1,
      gw = vbox.g2 - vbox.g1 + 1,
      bw = vbox.b2 - vbox.b1 + 1,
      maxw = pv.max([rw, gw, bw]);
  // only one pixel, no split
  if (vbox.count() == 1) {
    return [vbox.copy()];
  }
  /* Find the partial sum arrays along the selected axis. */
  var total = 0,
      partialsum = [],
      lookaheadsum = [],
      i,
      j,
      k,
      sum,
      index;
  if (maxw == rw) {
    for (i = vbox.r1; i <= vbox.r2; i++) {
      sum = 0;
      for (j = vbox.g1; j <= vbox.g2; j++) {
        for (k = vbox.b1; k <= vbox.b2; k++) {
          index = getColorIndex(i, j, k);
          sum += histo[index] || 0;
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  } else if (maxw == gw) {
    for (i = vbox.g1; i <= vbox.g2; i++) {
      sum = 0;
      for (j = vbox.r1; j <= vbox.r2; j++) {
        for (k = vbox.b1; k <= vbox.b2; k++) {
          index = getColorIndex(j, i, k);
          sum += histo[index] || 0;
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  } else {
    /* maxw == bw */
    for (i = vbox.b1; i <= vbox.b2; i++) {
      sum = 0;
      for (j = vbox.r1; j <= vbox.r2; j++) {
        for (k = vbox.g1; k <= vbox.g2; k++) {
          index = getColorIndex(j, k, i);
          sum += histo[index] || 0;
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  }
  partialsum.forEach(function (d, i) {
    lookaheadsum[i] = total - d;
  });
  function doCut(color) {
    var dim1 = color + '1',
        dim2 = color + '2',
        left,
        right,
        vbox1,
        vbox2,
        d2,
        count2 = 0;
    for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
      if (partialsum[i] > total / 2) {
        vbox1 = vbox.copy();
        vbox2 = vbox.copy();
        left = i - vbox[dim1];
        right = vbox[dim2] - i;
        if (left <= right) d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
        // avoid 0-count boxes
        while (!partialsum[d2]) {
          d2++;
        }count2 = lookaheadsum[d2];
        while (!count2 && partialsum[d2 - 1]) {
          count2 = lookaheadsum[--d2];
        } // set dimensions
        vbox1[dim2] = d2;
        vbox2[dim1] = vbox1[dim2] + 1;
        return [vbox1, vbox2];
      }
    }
  }
  // determine the cut planes
  return maxw == rw ? doCut('r') : maxw == gw ? doCut('g') : doCut('b');
}

function quantize(pixels, maxcolors) {
  // short-circuit
  if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
    return false;
  }

  // XXX: check color content and convert to grayscale if insufficient

  var histo = getHisto(pixels),
      histosize = 1 << 3 * sigbits;

  // check that we aren't below maxcolors already
  var nColors = 0;
  histo.forEach(function () {
    nColors++;
  });
  if (nColors <= maxcolors) {}
  // XXX: generate the new colors from the histo and return


  // get the beginning vbox from the colors
  var vbox = vboxFromPixels(pixels, histo),
      pq = new PQueue(function (a, b) {
    return pv.naturalOrder(a.count(), b.count());
  });
  pq.push(vbox);

  // inner function to do the iteration
  function iter(lh, target) {
    var ncolors = 1,
        niters = 0,
        vbox;
    while (niters < maxIterations) {
      vbox = lh.pop();
      if (!vbox.count()) {
        /* just put it back */
        lh.push(vbox);
        niters++;
        continue;
      }
      // do the cut
      var vboxes = medianCutApply(histo, vbox),
          vbox1 = vboxes[0],
          vbox2 = vboxes[1];

      if (!vbox1) {
        return;
      }
      lh.push(vbox1);
      if (vbox2) {
        /* vbox2 can be null */
        lh.push(vbox2);
        ncolors++;
      }
      if (ncolors >= target) return;
      if (niters++ > maxIterations) {
        return;
      }
    }
  }

  // first set of colors, sorted by population
  iter(pq, fractByPopulations * maxcolors);

  // Re-sort by the product of pixel occupancy times the size in color space.
  var pq2 = new PQueue(function (a, b) {
    return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume());
  });
  while (pq.size()) {
    pq2.push(pq.pop());
  }

  // next set - generate the median cuts using the (npix * vol) sorting.
  iter(pq2, maxcolors - pq2.size());

  // calculate the actual colors
  var cmap = new CMap();
  while (pq2.size()) {
    cmap.push(pq2.pop());
  }

  return cmap;
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=color-bandit.js.map