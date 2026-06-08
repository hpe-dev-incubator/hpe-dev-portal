import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

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
