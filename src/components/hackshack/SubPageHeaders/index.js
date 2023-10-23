// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'gatsby';
// import { Box, Button, Heading } from 'grommet';
// import { Previous } from 'grommet-icons';

// export const SubPageHeader = ({ children, title, ...rest }) => {
//   return (
//     <Box align="start" width="xlarge" direction="column" {...rest}>
//       <Box align="start">
//         <Link to="/hackshack/arcade">
//           <Button
//             color="white"
//             icon={<Previous size="small" />}
//             label="Back to Arcade"
//           />
//         </Link>
//         <Heading
//           color="text-strong"
//           level="1"
//           margin={{ bottom: 'large', top: 'none' }}
//         >
//           {title}
//         </Heading>
//       </Box>
//       {children}
//     </Box>
//   );
// };
// export default SubPageHeader;

// SubPageHeader.propTypes = {
//   children: PropTypes.node.isRequired,
//   title: PropTypes.string,
// };
