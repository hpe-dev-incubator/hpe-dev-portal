import React, { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { StyledGrid } from './styles';

const CardGrid = ({ children, size, ...rest }) => {
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { size });
    }

    return child;
  });
  return (
    <StyledGrid gap="large" {...rest}>
      {childrenWithProps}
    </StyledGrid>
  );
};

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
};

export default CardGrid;
