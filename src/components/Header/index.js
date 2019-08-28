import React from 'react';
// import { Link as GatsbyLink } from 'gatsby';
import { Box, Text } from 'grommet';
import { Hpe, More } from 'grommet-icons';
import { Link } from '..';
// import { useSiteMetadata } from '../../hooks/use-site-metadata';

/*
Adding CaaS header/footer
in the head tag-
<script src="http://h50007.www5.hpe.com/hfws-static/js/framework/jquery/v-2-2-0/jquery.js"></script>
<script src="http://h50007.www5.hpe.com/hfws/us/en/hpe/slim/root?contentType=js&hide_head_text=true"></script>

in the body tag -
  <div id="header_wrapper">
    <div id="hpe_slim_header" class="hpe_slim_header" style="pointer-events: none;"></div>
  </div>
  <div id="content"> <!-- main React div -->
  <div id="hpe_slim_footer" class="hpe_slim_footer"></div>

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
*/
function Header() {
  // const siteMetadata = useSiteMetadata();

  return (
    <Box>
      <Box
        direction="row"
        gap="small"
        pad={{ vertical: 'small', horizontal: 'medium' }}
        justify="between"
      >
        <Link to="/">
          <Hpe color="brand" />
        </Link>
        <More />
      </Box>
      <Box
        direction="row"
        gap="small"
        pad={{ vertical: 'xsmall', horizontal: 'medium' }}
        justify="between"
      >
        <Text weight="bold" color="dark-1">
          HPE Developer
        </Text>
        <Box direction="row" gap="medium" justify="center">
          <Link to="/research">Research</Link>
          <Link to="/design">Design</Link>
          <Link to="/develop">Develop</Link>
          <Link to="/support">Support</Link>
        </Box>
      </Box>
    </Box>
  );
}
export default Header;
