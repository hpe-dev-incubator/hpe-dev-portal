import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';
import ImageUploadControl from './imageUploadControl';


CMS.registerMediaLibrary(cloudinary);
CMS.registerWidget('imageUpload', ImageUploadControl);
CMS.registerEditorComponent({
  // Internal id of the component
  id: "image",
  // Visible label
  label: "Image",
  // Fields the user need to fill out when adding an instance of the component
  fields: [{name: 'src', label: 'Image', widget: 'imageUpload'}],
  // Pattern to identify a block as being an instance of this component
  pattern: /^<img src="(.*)" $/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      image: match[1]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return `<img src=${obj.src} />`;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return `<img src=${obj.src} />`;
  },
});
