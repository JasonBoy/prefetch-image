(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["prefetchImages"] = factory();
	else
		root["prefetchImages"] = factory();
})(this, function() {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else context[name] = definition();
})('urljoin', undefined, function () {

  function startsWith(str, searchString) {
    return str.substr(0, searchString.length) === searchString;
  }

  function normalize(str, options) {

    if (startsWith(str, 'file://')) {

      // make sure file protocol has max three slashes
      str = str.replace(/(\/{0,3})\/*/g, '$1');
    } else {

      // make sure protocol is followed by two slashes
      str = str.replace(/:\//g, '://');

      // remove consecutive slashes
      str = str.replace(/([^:\s%3A])\/+/g, '$1/');
    }

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    str = str.replace(/(\?.+)\?/g, '$1&');

    return str;
  }

  return function () {
    var input = arguments;
    var options = {};

    if (_typeof(arguments[0]) === 'object') {
      // new syntax with array and options
      input = arguments[0];
      options = arguments[1] || {};
    }

    var joined = [].slice.call(input, 0).join('/');
    return normalize(joined, options);
  };
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * @license MIT
 * Prefetch all images for your web app, especially for mobile/h5 promotion pages.
 * https://github.com/JasonBoy/prefetch-image
 */



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _urlJoin = __webpack_require__(0);

var _urlJoin2 = _interopRequireDefault(_urlJoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Preload all images
 * @param {Array|object} images, use object if your images are on different domains
 * object:
 * {
 *   "http://domain1.com": ['/image1.png', '/image2.png'],
 *   "http://domain2.com": ['/image3.png', '/image4.png'],
 * }
 * @param {object=} options
 * @return {Promise}
 */
function prefetchImages(images) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!images) {
    console.error('[prefetch-image]: images not provided, pls pass images in Array or object!');
    return Promise.reject({});
  }
  var isArray = Array.isArray(images);
  if (isArray) {
    return prefetchImageEachDomain(images, options);
  }
  var domainPromises = [];
  var domainKeys = Object.keys(images);
  var i = 0;
  for (; i < domainKeys.length; i++) {
    var domain = domainKeys[i];
    domainPromises.push(prefetchImageEachDomain(joinUrls(domain, images[domain]), options, domain));
  }
  return Promise.all(domainPromises).then(function (results) {
    console.info('[prefetch-image]: Images loaded for all domains!');
    return Promise.resolve(results);
  }).catch(function (err) {
    console.error('[prefetch-image]: ', err);
    return Promise.reject(null);
  });
}

/**
 * Preload all images in the same domain
 * @param {Array} images all image urls in the same domain
 * @param {object=} options
 * @param {string=} domain current domain
 * @return {Promise}
 */
function prefetchImageEachDomain(images, options, domain) {
  var concurrency = options.concurrency || 6;
  var imageLoadingInfo = {
    start: 0,
    end: 0,
    //how many images for each iteration
    //e.g. 15 images total, 6 images max each time, result: 6, 6, 3, iterateCount will be 3
    concurrency: concurrency,
    iterations: Math.ceil(images.length / concurrency),
    imagesContainer: []
  };
  var bulkImagePromises = []; //length equals to "iterations"
  var i = 0;
  for (; i < imageLoadingInfo.iterations; i++) {
    bulkImagePromises.push(loadImages(images, imageLoadingInfo));
  }
  // console.log('bulkImagePromisesLength: %d', bulkImagePromises.length);
  return Promise.all(bulkImagePromises).then(function () {
    addAllImagesToDOM(imageLoadingInfo.imagesContainer);
    console.info('[prefetch-image]: Images loaded for domain [' + (domain || location.origin) + '], length [' + images.length + ']');
    return Promise.resolve(imageLoadingInfo.imagesContainer);
  }).catch(function (err) {
    console.error('[prefetch-image]: ', err);
    return Promise.reject(imageLoadingInfo.imagesContainer);
  });
}

function loadImages(images, imageLoadingInfo) {
  var imagePromises = [];
  var allImageLength = images.length;
  var info = imageLoadingInfo;
  if (info.start >= allImageLength) {
    return Promise.resolve([]);
  }
  var start = info.start;
  var end = start + info.concurrency;
  // console.log(`${start} - ${end}`);
  var i = start;
  for (; i < end; i++) {
    var src = images[i];
    if (!src) continue;
    imagePromises.push(loadImage(src, info.imagesContainer));
  }
  info.start = end;
  info.end = end + info.concurrency;
  // console.log('imagePromises: ', imagePromises.length);

  return Promise.all(imagePromises);
}

function loadImage(src, container) {
  // console.log('--> start loading img: %s', src);
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      // console.log(`src: ${src}`);
      resolve(src);
    };
    img.onerror = function () {
      console.error('[prefetch-image]: "' + src + '" failed');
      //still resolve even if some image failed loading
      resolve(src);
    };
    img.src = src;
    container.push(img);
  });
}

function addAllImagesToDOM(imageElements) {
  var body = document.querySelector('body');
  var imagesWrapper = document.createElement('div');
  imagesWrapper.setAttribute('class', 'prefetch-image-wrapper_' + Math.random());
  imagesWrapper.style.width = 0;
  imagesWrapper.style.height = 0;
  imagesWrapper.style.overflow = 'hidden';
  // imagesWrapper.style.opacity = 0;
  imagesWrapper.style.display = 'none';
  imageElements.forEach(function (img) {
    imagesWrapper.appendChild(img);
  });
  body.appendChild(imagesWrapper);
}

function joinUrls(domain, urls) {
  var newUrls = [];
  urls.forEach(function (url) {
    newUrls.push((0, _urlJoin2.default)(domain, url));
  });
  return newUrls;
}

exports.default = prefetchImages;

/***/ })
/******/ ]);
});
//# sourceMappingURL=prefetch-image.js.map