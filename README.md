# prefetch-image [![npm](https://img.shields.io/npm/v/prefetch-image.svg)](https://www.npmjs.com/package/prefetch-image)
Prefetch all images for your web app, especially for mobile/h5 promotion pages.

## Usage

`npm install prefetch-image --save` or
`yarn add prefetch-image`

```javascript
const prefetchImages = require('prefetch-image');
//or
//import prefetchImages from 'prefetch-image';

const images = [
  '/1.png',
  '/2.jpg',
  '/3.png',
];
prefetchImages(images, options)
  .then((result) => {
    //result is an array containing all the "Image" objects
    console.log('all images loaded!');
    //start init your page logic...
  });

// or with multiple domain object
const imagesOnMultipleDomains = {
  'http://domain1.com': ['/image1.png', '/image2.png'],
  'http://domain2.com': ['/image3.png', '/image4.png'],
};
prefetchImages(imagesOnMultipleDomains, options)
  .then((results) => {
    //result is an array containing all the "Image" objects grouped by domains, e.g
    //results = [${domain1ImagesArray}, ${domain2ImagesArray}]
    console.log('all images loaded!');
    //start init your page logic...
  });
```
> Don't forget to add `Cache-Control` for your assets

### Options

- concurrency: number of images be loading concurrently on each domain, default: 6
- debug: boolean, default false

## LICENSE

MIT
