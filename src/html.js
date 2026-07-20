/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

export default function HTML(props) {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta charSet="UTF-8" />
        <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
        <meta content="hpe.1.0" name="hp_design_version" />
        <meta
          content="HPE Developer Community Portal, HPE Dev Portal, Developers, Developer Community"
          name="keywords"
        />
        <meta httpEquiv="Content-Language" content="en" />
        <meta content="support" name="lifecycle" />
        <meta name="robots" content="follow, index" />
        <meta name="segment" content="corporate" />
        <meta name="target_country" content="ww" />
        <meta name="web_section_id" content="R12362" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta content="CORP" name="bu" />
        <meta content="products" name="page_content" />
        {props.headComponents}
        <link rel="icon" sizes="32x32" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root { color-scheme: only light; }
            body { background-color: #ffffff; }
            #header { background-color: #ffffff; }
            .hpehf-centered-content { padding-left: max(24px, calc((100% - 1600px) / 2)) !important; padding-right: max(24px, calc((100% - 1600px) / 2)) !important; box-sizing: border-box !important; }`,
          }}
        />
        {/* HPE Header Framework config — must be set before framework scripts load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.HPEHF_CFG = {
  mainNav: {
    micrositeLogoArea: {
      logo: {
        href: '/',
        title: 'HPE Developer portal',
        dataAnalyticsRegionId: 'gmenu|HPE Developer portal'
      },
      micrositeTitle: 'Developer'
    },
    navLinks: [
      {
        title: 'Topics', href: '/topics', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Topics',
        navLinks: [
          {title: 'AI & Data', href: '/topic/ai-and-data/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|AI & Data'},
          {title: 'Compute', href: '/topic/compute/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Compute'},
          {title: 'Hybrid Cloud', href: '/topic/hybrid-cloud/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Hybrid Cloud'},
          {title: 'Networking', href: '/topic/networking/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Networking'},
          {title: 'Software & Services', href: '/topic/software-and-services/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Software & Services'},
          {title: 'Storage', href: '/topic/storage/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Storage'}
        ]
      },
      {
        title: 'GreenLake', href: '/greenlake', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|GreenLake',
        navLinks: [
          {title: 'HPE Aruba Networking Central', href: '/greenlake/aruba-central/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Aruba Central'},
          {title: 'Data Services Cloud Console', href: '/greenlake/data-services-cloud-console/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Data Services Cloud Console'},
          {title: 'Data Services on the HPE GreenLake platform', href: '/greenlake/data-services-on-the-hpe-greenlake-platform/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Data Services GreenLake'},
          {title: 'HPE GreenLake edge-to-cloud platform', href: '/greenlake/hpe-greenlake-cloud-platform/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|GreenLake edge-to-cloud'},
          {title: 'HPE Compute Ops Management', href: '/greenlake/hpe-greenlake-for-compute-ops-management/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Compute Ops Management'},
          {title: 'HPE Private Cloud Enterprise', href: '/greenlake/hpe-greenlake-for-private-cloud-enterprise/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Private Cloud Enterprise'}
        ]
      },
      {title: 'Products', href: '/platforms', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Products',
        navLinks: [
          {title: 'All Products', href: '/platforms', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|All Products'},
          {title: 'HPE Private Cloud AI', href: '/platform/hpe-private-cloud-ai/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE Private Cloud AI'},
          {title: 'HPE Swarm Learning', href: '/platform/swarm-learning/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE Swarm Learning'},
          {title: 'HPE Cray Programming Environment', href: '/platform/hpe-cray-programming-environment/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE Cray Programming Environment'},
          {title: 'HPE NonStop', href: '/platform/hpe-nonstop/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE NonStop'},
          {title: 'OpenCHAMI', href: '/platform/openchami/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|OpenCHAMI'},
          {title: 'Morpheus', href: '/platform/morpheus/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Morpheus'},
          {title: 'HPE OpsRamp', href: '/platform/hpe-opsramp/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE OpsRamp'},
          {title: 'Zerto', href: '/platform/zerto/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Zerto'},
          {title: 'HPE Alletra', href: '/platform/hpe-alletra/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE Alletra'},
          {title: 'HPE 3PAR and Primera', href: '/platform/hpe-3par-and-primera/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE 3PAR and Primera'},
          {title: 'HPE Nimble Storage', href: '/platform/hpe-nimble-storage/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE Nimble Storage'},
          {title: 'HPE OneView', href: '/platform/hpe-oneview/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE OneView'},
          {title: 'HPE OneView Global Dashboard', href: '/platform/hpe-oneview-global-dashboard/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE OneView Global Dashboard'},
          {title: 'HPE SimpliVity', href: '/platform/hpe-simplivity/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|HPE SimpliVity'},
          {title: 'iLO RESTful API', href: '/platform/ilo-restful-api/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|iLO RESTful API'}
        ]
      },
      {title: 'Open Source', href: '/opensource', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Open Source',
        navLinks: [
          {title: 'Chapel', href: '/platform/chapel/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Chapel'},
          {title: 'Determined AI', href: '/platform/determined-ai/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Determined AI OS'},
          {title: 'DragonHPC', href: '/platform/dragonhpc/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|DragonHPC'},
          {title: 'Grommet', href: '/platform/grommet/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Grommet'},
          {title: 'KubeDirector', href: '/platform/kubedirector/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|KubeDirector'},
          {title: 'OpenCHAMI', href: '/platform/openchami/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|OpenCHAMI'},
          {title: 'SPIFFE & SPIRE', href: '/platform/spiffe-and-spire-projects/home/', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|SPIFFE SPIRE'},
          {title: 'All Open Source', href: '/opensource', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|All Open Source'}
        ]
      },
      {title: 'Blog', href: '/blog', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Blog'},
      {title: 'Events', href: '/events', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Events'},
      {title: 'Training', href: '/skillup', newWindow: false, dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Training'},
      {title: 'Join the Community', href: '/community', newWindow: false, type: 'cta', dataAnalyticsRegionId: 'gmenu|HPE Developer Main Nav|Community'}
    ]
  },
  headerSearch: {
    placeholderText: 'Search HPE Developer portal...',
    action: 'https://developer.hpe.com/search/',
    inputName: 'term'
  }
};
`,
          }}
        />
        {/* HPE Header Framework scripts — jQuery first, then the framework */}
        <script src="https://h50007.www5.hpe.com/hfws-static/js/framework/jquery/v-3-6-0/jquery.js" />
        <script src="https://h50007.www5.hpe.com/hfws/us/en/hpe/latest.r/root?contentType=js&expand_view=true" />
      </head>
      <body style={{ margin: 0 }} {...props.bodyAttributes}>
        {/* HPE global header — populated by HPEHF framework */}
        <div id="header" className="header" />
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        {/* <div id="header_wrapper">
          <div
            id="hpe_slim_header"
            className="hpe_slim_header"
            style={{ pointerEvents: 'none' }}
          />
        </div> */}
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        <div id="footer" className="footer" />
        {props.postBodyComponents}
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.23.0/phaser.min.js" integrity="sha512-FgqGgzXpW1P9AjZuhLDIE5E5jH1ntIkrv3VKB36HoET27Ek2w60HenbIr21+rCu1qZ/Fvl64PkxNRP51a9m2Nw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script type="text/javascript" src="https://www.hpe.com/global/metrics/easy/basic_measurement.js"></script>
        <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
        <script type="text/javascript">	
          function pageLoaded() {
            var header = document.getElementById('hpe_slim_header');	
            var headerWrapper = document.getElementById('header_wrapper');	

            if (!header || !headerWrapper) {
              return;
            }

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
          window.digitalData = {
              page: {
                  pageInfo: {
                      breadCrumbs: ['v2.0', 'us', 'en', 'non-aem:developer', 'devhome']
                  }
              }
          }
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
