window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

init({
  config: {
    media_library: {
      config: {
        signature:
          'c8cbf1fd4353ff060aa4190008209b07ad8a6f2c3d7b09e4b7238363761d8cdd',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);
