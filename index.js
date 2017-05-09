/*!
 * @license MIT
 * Prefetch all images for your web app, especially for mobile/h5 promotion pages.
 * https://github.com/JasonBoy/prefetch-image
 */

'use strict';

function prefetchImages(images, options = {}) {
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
      console.info('[prefetch-image]: All images loaded!');
      return Promise.resolve(imageLoadingInfo.imagesContainer);
    })
    .catch((err) => {
      console.error('[prefetch-image]: ', err);
      return Promise.reject(imageLoadingInfo.imagesContainer);
    });
}

function loadImages (images, imageLoadingInfo) {
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
    if(!src) continue;
    imagePromises.push(loadImage(src, info.imagesContainer));
  }
  info.start = end;
  info.end = end + info.concurrency;
  // console.log('imagePromises: ', imagePromises.length);

  return Promise.all(imagePromises);
}

function loadImage (src, container) {
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

export default prefetchImages;