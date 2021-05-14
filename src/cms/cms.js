window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

let myJson;
const userAction = async () => {
  try {
    const response = await fetch(
      'https://hackshack.hpedev.io/.netlify/functions/cloudinary',
    );
    myJson = await response.json();
    console.log('netlify function response', myJson);
  } catch (err) {
    console.log('netlify function call error', err);
  }
};

userAction();

init({
  config: {
    media_library: {
      config: {
        signature:
          '7e1bd971329791e8348f729680a66ca171fc2024c395f26ec4e82b14ff2c289e',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);
