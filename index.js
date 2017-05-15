/*!
 * @license MIT
 * Prefetch all images for your web app, especially for mobile/h5 promotion pages.
 * https://github.com/JasonBoy/prefetch-image
 */

'use strict';

import joinUrl from 'url-join';

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
function prefetchImages(images, options = {}) {
  if(!images) {
    console.error('[prefetch-image]: images not provided, pls pass images in Array or object!');
    return Promise.reject({});
  }
  const isArray = Array.isArray(images);
  if(isArray) {
    return prefetchImageEachDomain(images, options);
  }
  const domainPromises = [];
  const domainKeys = Object.keys(images);
  let i =0;
  for(; i < domainKeys.length; i++) {
    const domain = domainKeys[i];
    domainPromises.push(
      prefetchImageEachDomain(
        joinUrls(domain, images[domain]),
        options,
        domain
      )
    );
  }
  return Promise.all(domainPromises)
    .then((results) => {
      options.debug && console.info('[prefetch-image]: Images loaded for all domains!');
      return Promise.resolve(results);
    })
    .catch((err) => {
      console.error('[prefetch-image]: ', err);
      return Promise.reject(null);
    })
    ;
}

/**
 * Preload all images in the same domain
 * @param {Array} images all image urls in the same domain
 * @param {object=} options
 * @param {string=} domain current domain
 * @return {Promise}
 */
function prefetchImageEachDomain (images, options, domain) {
  const concurrency = options.concurrency || 6;
  const imageLoadingInfo = {
    start: 0,
    end: 0,
    //how many images for each iteration
    //e.g. 15 images total, 6 images max each time, result: 6, 6, 3, iterateCount will be 3
    concurrency,
    iterations: Math.ceil(images.length / concurrency),
    imagesContainer: [],
  };
  const bulkImagePromises = []; //length equals to "iterations"
  let i = 0;
  for (; i < imageLoadingInfo.iterations; i++) {
    bulkImagePromises.push(loadImages(images, imageLoadingInfo));
  }
  // console.log('bulkImagePromisesLength: %d', bulkImagePromises.length);
  return Promise.all(bulkImagePromises)
    .then(() => {
      addAllImagesToDOM(imageLoadingInfo.imagesContainer);
      options.debug && console.info(`[prefetch-image]: Images loaded for domain [${domain || location.origin}], length [${images.length}]`);
      return Promise.resolve(imageLoadingInfo.imagesContainer);
    })
    .catch((err) => {
      console.error('[prefetch-image]: ', err);
      return Promise.reject(imageLoadingInfo.imagesContainer);
    });
}

/**
 * Load images on an array
 * @param {Array} images
 * @param {object} imageLoadingInfo info about this phase of loading
 * @return {Promise}
 */
function loadImages(images, imageLoadingInfo) {
  const imagePromises = [];
  const allImageLength = images.length;
  const info = imageLoadingInfo;
  if (info.start >= allImageLength) {
    return Promise.resolve([]);
  }
  const start = info.start;
  const end = start + info.concurrency;
  // console.log(`${start} - ${end}`);
  let i = start;
  for (; i < end; i++) {
    const src = images[i];
    if (!src) continue;
    imagePromises.push(loadImage(src, info.imagesContainer));
  }
  info.start = end;
  info.end = end + info.concurrency;
  // console.log('imagePromises: ', imagePromises.length);

  return Promise.all(imagePromises);
}

/**
 * Start loading every single image
 * @param {string} src image src
 * @param {array} container new Image instance will be added to this container
 * @return {Promise}
 */
function loadImage(src, container) {
  // console.log('--> start loading img: %s', src);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // console.log(`src: ${src}`);
      resolve(src);
    };
    img.onerror = () => {
      console.error(`[prefetch-image]: "${src}" failed`);
      //still resolve even if some image failed loading
      resolve(src);
    };
    img.src = src;
    container.push(img);
  });
}

/**
 * Add all images loaded to dom to ensure cache
 * @param {Array} imageElements Image objects in an array
 */
function addAllImagesToDOM(imageElements) {
  const body = document.querySelector('body');
  const imagesWrapper = document.createElement('div');
  imagesWrapper.setAttribute('class', `prefetch-image-wrapper_${Math.random()}`);
  imagesWrapper.style.width = 0;
  imagesWrapper.style.height = 0;
  imagesWrapper.style.overflow = 'hidden';
  // imagesWrapper.style.opacity = 0;
  imagesWrapper.style.display = 'none';
  imageElements.forEach((img) => {
    imagesWrapper.appendChild(img);
  });
  body.appendChild(imagesWrapper);
}

/**
 * Join domain for urls
 * @param {string} domain
 * @param {array} urls url paths
 * @return {Array}
 */
function joinUrls (domain, urls) {
  const newUrls = [];
  urls.forEach((url) => {
    newUrls.push(joinUrl(domain, url));
  });
  return newUrls;
}

export default prefetchImages;