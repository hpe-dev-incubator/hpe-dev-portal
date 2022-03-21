import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from 'grommet';
import { MainButton, PinkBox, TealBox } from './styles';

export const ButtonSplit = ({ to, children }) => {
  const [hover, setHover] = useState(false);
  // Each box needs to include the child text to maintain
  // dynamic width
  const TextSizeHolder = () => (
    <Text color="rgba(0,0,0,0)" size="large" weight="bold">
      {children}
    </Text>
  );
  return (
    <MainButton
      plain
      href={to}
      target="_blank"
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onBlur={() => setHover(false)}
    >
      <Box>
        <Stack>
          <TealBox
            background="teal!"
            pad={{ horizontal: 'large', vertical: 'small' }}
            round="small"
          >
            <TextSizeHolder />
          </TealBox>
          <PinkBox
            background="#F740FF"
            pad={{ horizontal: 'large', vertical: 'small' }}
            round="small"
          >
            <TextSizeHolder />
          </PinkBox>
          <Box pad={{ horizontal: 'large', vertical: 'small' }}>
            <Text color={hover ? 'black' : 'dark-1'} size="large" weight="bold">
              {children}
            </Text>
          </Box>
          {/* 
              The hit area of the button changes when the boxes are
              animated The below Boxes keep the hit area
              consistent regardless of hover state
          */}
          <Box
            style={{
              transform: 'translate(5px) translateY(5px)',
            }}
            pad={{ horizontal: 'large', vertical: 'small' }}
            opacity={0}
          >
            <TextSizeHolder />
          </Box>
          <Box
            style={{
              transform: 'translate(-5px) translateY(-5px)',
            }}
            pad={{ horizontal: 'large', vertical: 'small' }}
            opacity={0}
          >
            <TextSizeHolder />
          </Box>
        </Stack>
      </Box>
    </MainButton>
  );
};

ButtonSplit.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default ButtonSplit;
