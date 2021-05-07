window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

init({
  config: {
    media_library: {
      config: {
        signature:
          '77307771588f59e6519a01d4a6411b4cb0b16c8db0a429701cf3fedf7f4c160d',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);
