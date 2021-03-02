import React from 'react';
import PropTypes from 'prop-types';
import { Grid, ResponsiveContext } from 'grommet';

const ResponsiveGrid = ({ children, columns, rows, ...props }) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      return (
        <Grid
          margin="medium"
          gap="large"
          {...props}
          rows={rows[size]}
          columns={columns[size]}
        >
          {children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);

ResponsiveGrid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.object,
  rows: PropTypes.object,
};

export default ResponsiveGrid;
