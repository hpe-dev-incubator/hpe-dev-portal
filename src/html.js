/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

export default function HTML(props) {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta charSet="UTF-8" />
        <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
        <meta
          content="Find the resources you need to design and build the best possible software experiences that harness the most value from your data. Connect through the HPE Developer Community to build, communicate, and collaborate. We’re all developing something. Come join us in making the future."
          name="description"
        />
        <meta content="hpexpnontridion" name="hp_design_version" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta
          content="HPE Developer Community Portal, HPE Dev Portal, Developers, Developer Community"
          name="keywords"
        />
        <meta httpEquiv="Content-Language" content="en" />
        <meta content="support" name="lifecycle" />
        <meta name="robots" content="follow, index" />
        <meta name="segment" content="corporate" />
        <meta name="target_country" content="us" />
        <meta name="web_section_id" content="R11852" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta content="CORP" name="bu" />
        <meta content="products" name="page_content" />
        {props.headComponents}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            #site-branding {
              left: -15px;
            }`,
          }}
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div id="header_wrapper">
          <div
            id="hpe_slim_header"
            className="hpe_slim_header"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        <div id="hpe_slim_footer" className="hpe_slim_footer" />
        {props.postBodyComponents}
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <script type="text/javascript">	
          function pageLoaded() {
            var header = document.getElementById('hpe_slim_header');	
            var headerWrapper = document.getElementById('header_wrapper');	
            var timer;	
            headerWrapper.addEventListener('mouseover', function(event) {	
              timer = setTimeout(function() {	
                header.style.pointerEvents = "auto";	
              }, 250);	
            });	
            headerWrapper.addEventListener('mouseleave', function(event) {	
              clearTimeout(timer);	
              header.style.pointerEvents = "none";	
            });		
          }

          if (window.addEventListener) window.addEventListener('DOMContentLoaded', pageLoaded, false);	
          else if (window.attachEvent) window.attachEvent('onload', pageLoaded);	
        </script>
        `,
          }}
        />
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
