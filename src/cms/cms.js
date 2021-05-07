window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

init({
  config: {
    media_library: {
      config: {
        signature:
          'c0a3c681bfe5e6970644a3502c87fe68027533d66b235f4254b77bb31fb14535',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);
