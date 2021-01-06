import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Image, Heading, Button, Grid, ResponsiveContext } from 'grommet';
import { Link as GatsbyLink } from 'gatsby';

const NavLink = styled(GatsbyLink)`
  text-decoration: none;
`;

export const EventCard = ({ timeframe, link, image, title }) => (
  <Box elevation="medium" pad="large" direction="row" wrap gap="large">
    <NavLink to={link}>
      <Box direction="row-responsive" gap="large" align="center">
        <Box justify="between" direction="row-responsive">
          <Box gap="medium">
            <Box gap="small">
              <Heading color="text" margin="none">
                {title}
              </Heading>
              <Heading color="text" margin="none" level="3">
                {timeframe}
              </Heading>
            </Box>
            <Box direction="row">
              <Button primary label="View Events Page"></Button>
            </Box>
          </Box>
          <Box>{image && <Image fit="contain" src={image} />}</Box>
        </Box>
      </Box>
    </NavLink>
  </Box>
);
EventCard.propTypes = {
  timeframe: PropTypes.string,
  link: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
};

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

export const PastEventCard = ({
  children,
  overrideColumns,
  overrideRows,
  areas,
  ...props
}) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      // Take into consideration if not array is sent but a simple string
      let columnsVal = columns;
      if (columns) {
        if (columns[size]) {
          columnsVal = columns[size];
        }
      }

      let rowsVal = rows;
      if (rows) {
        if (rows[size]) {
          rowsVal = rows[size];
        }
      }

      // Also if areas is a simple array not an object of arrays for
      // different sizes
      let areasVal = areas;
      if (areas && !Array.isArray(areas)) areasVal = areas[size];

      return (
        <Grid
          {...props}
          areas={!areasVal ? undefined : areasVal}
          rows={!rowsVal ? size : rowsVal}
          columns={!columnsVal ? size : columnsVal}
        >
          {children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);

PastEventCard.propTypes = {
  overrideColumns: PropTypes.string,
  children: PropTypes.node,
  overrideRows: PropTypes.string,
  areas: PropTypes.string,
};
