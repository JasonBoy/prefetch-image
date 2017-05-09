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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
function prefetchImages(images) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
    console.info('[prefetch-image]: All images loaded!');
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

exports.default = prefetchImages;

/***/ })
/******/ ]);
});
//# sourceMappingURL=prefetch-image.js.map