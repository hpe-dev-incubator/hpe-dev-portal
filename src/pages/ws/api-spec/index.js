import React, { useEffect } from 'react';
import { RedocStandalone } from 'redoc';

const ApiDocs = () => {
  // Redoc offsets its scroll by the header height itself (scrollYOffset), so the
  // site-wide html scroll-padding-top would push targets below its scroll-spy
  // line and activate the previous menu item.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollPaddingTop;
    html.style.scrollPaddingTop = '0px';
    return () => {
      html.style.scrollPaddingTop = previous;
    };
  }, []);

  return (
    <RedocStandalone
      specUrl="/openapi_wsapiv3_2.6.0_en-US.json"
      options={{ scrollYOffset: '#header' }}
    />
  );
};

export default ApiDocs;
