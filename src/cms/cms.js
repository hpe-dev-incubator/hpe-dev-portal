window.CMS_MANUAL_INIT = true;
import CMS, { init } from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

let myJson;
const userAction = async () => {
  try {
    console.log('just before call');
    const url = '/.netlify/functions/cloudinary';
    const response = await fetch(url);
    myJson = await response.json();
    console.log('netlify function response', myJson);
  } catch (err) {
    console.log('error', err);
  }
};
userAction();
console.log('after making a function call to cloudinary api');

init({
  config: {
    media_library: {
      config: {
        signature:
          'e70ca0031407e281c0e0ead8d6c73791a2eda402267273a20b8ca9451adbb09b',
      },
    },
  },
});

CMS.registerMediaLibrary(cloudinary);

const injectCustomStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = `
      div[data-slate-editor] {
        -webkit-user-modify: read-write !important;
      }
    `;
  document.head.appendChild(style);
};

injectCustomStyle();
