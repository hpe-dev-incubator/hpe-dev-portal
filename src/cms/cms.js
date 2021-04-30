import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';
import ImageUploadControl from './imageUploadControl';
// import './styles.css';

CMS.init();
CMS.registerMediaLibrary(cloudinary);
CMS.registerWidget('imageUpload', ImageUploadControl);
