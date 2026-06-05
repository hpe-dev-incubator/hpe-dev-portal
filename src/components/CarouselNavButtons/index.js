import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Btn = styled.button`
  width: ${({ btnSize }) => btnSize}px;
  height: ${({ btnSize }) => btnSize}px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ bg }) => bg};
  color: ${({ iconColor }) => iconColor};
  transition:
    background-color 0.2s,
    opacity 0.2s;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.8;
  }
`;

const ChevronLeft = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M13 4L7 10L13 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ChevronLeft.propTypes = { size: PropTypes.number.isRequired };

const ChevronRight = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 4L13 10L7 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ChevronRight.propTypes = { size: PropTypes.number.isRequired };

const CarouselNavButtons = ({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  ariaLabelPrev = 'Previous',
  ariaLabelNext = 'Next',
  size = 56,
  iconSize = 20,
  prevColor = '#b1b9be',
  nextColor = '#535c66',
  prevIconColor = '#292d3a',
  nextIconColor = '#ffffff',
  marginTop = '24px',
}) => (
  <Row style={{ marginTop }}>
    <Btn
      onClick={onPrev}
      disabled={disablePrev}
      aria-label={ariaLabelPrev}
      btnSize={size}
      bg={prevColor}
      iconColor={prevIconColor}
    >
      <ChevronLeft size={iconSize} />
    </Btn>
    <Btn
      onClick={onNext}
      disabled={disableNext}
      aria-label={ariaLabelNext}
      btnSize={size}
      bg={nextColor}
      iconColor={nextIconColor}
    >
      <ChevronRight size={iconSize} />
    </Btn>
  </Row>
);

CarouselNavButtons.propTypes = {
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  disablePrev: PropTypes.bool,
  disableNext: PropTypes.bool,
  ariaLabelPrev: PropTypes.string,
  ariaLabelNext: PropTypes.string,
  size: PropTypes.number,
  iconSize: PropTypes.number,
  prevColor: PropTypes.string,
  nextColor: PropTypes.string,
  prevIconColor: PropTypes.string,
  nextIconColor: PropTypes.string,
  marginTop: PropTypes.string,
};

export default CarouselNavButtons;
