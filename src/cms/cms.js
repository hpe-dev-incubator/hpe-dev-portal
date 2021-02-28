import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

console.log('cms executed');
CMS.registerMediaLibrary(cloudinary);
