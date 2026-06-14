import CMS from 'decap-cms-app';

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
