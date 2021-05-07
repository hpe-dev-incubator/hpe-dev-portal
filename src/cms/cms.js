window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

init({
  config: {
    media_library: {
      config: {
        signature:
          '428942879918aae8eb9390200af32ebacdb593601e2956d00506d12d067e0464',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);
